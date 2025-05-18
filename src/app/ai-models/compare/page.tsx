'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, ArrowUpDown, ExternalLink, Check, X } from 'lucide-react';
import { aiModelsApi } from '@/lib/api';
import Link from 'next/link';

// Value for money scoring criteria weights
const CRITERIA_WEIGHTS = {
  FEATURES_COUNT: 0.3,      // 30% weight for number of features
  POPULARITY: 0.3,          // 30% weight for popularity score
  PRICING_SCORE: 0.4,       // 40% weight for pricing affordability
};

// Pricing score mapping (lower is better)
const PRICING_SCORES = {
  'free': 10,
  'freemium': 8,
  'subscription': 6,
  'pay-as-you-go': 5,
  'enterprise': 3
};

interface AIModel {
  id: number;
  name: string;
  category: string;
  company: string;
  pricing: string;
  features: string[];
  popularity: number;
  releaseDate: string;
  image?: string;
  description?: string;
  details?: any;
  valueScore?: number;
}

export default function CompareModelsPage() {
  const searchParams = useSearchParams();

  // 모델 ID를 메모이제이션하여 불필요한 리렌더링 방지
  const modelIds = useMemo(() => {
    return searchParams.getAll('models').map(id => parseInt(id));
  }, [searchParams]);

  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'popularity' | 'valueScore'>('valueScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // 데이터 로딩 상태 추적
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    // 이미 데이터를 가져왔으면 다시 가져오지 않음
    if (dataFetched) return;

    const fetchModelsData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (modelIds.length === 0) {
          setError('비교할 모델이 선택되지 않았습니다.');
          setLoading(false);
          return;
        }

        // 각 모델의 데이터와 상세 정보 가져오기
        const modelsData = await Promise.all(
          modelIds.map(async (id) => {
            const model = await aiModelsApi.getById(id.toString());
            const details = await aiModelsApi.getModelDetails(id);

            if (!model) {
              throw new Error(`ID ${id}에 해당하는 모델을 찾을 수 없습니다.`);
            }

            return { ...model, details };
          })
        );

        // 가치 점수 계산
        const modelsWithScores = modelsData.map(model => {
          const valueScore = calculateValueScore(model);
          return { ...model, valueScore };
        });

        setModels(modelsWithScores);
        setDataFetched(true); // 데이터를 성공적으로 가져왔음을 표시
      } catch (err) {
        console.error('모델 데이터를 가져오는 중 오류 발생:', err);
        setError('모델 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchModelsData();
  }, [modelIds, dataFetched]);

  // 가치 점수 계산 함수
  const calculateValueScore = (model: AIModel): number => {
    // 1. 기능 점수 (기능 수에 비례)
    const featuresCount = model.features.length;
    const featuresScore = Math.min(featuresCount / 5, 1) * 10; // 최대 5개 기능을 10점 만점으로

    // 2. 인기도 점수 (이미 0-100 범위)
    const popularityScore = model.popularity / 10; // 0-10 범위로 변환

    // 3. 가격 점수 (가격 유형에 따라 다름)
    let pricingScore = 5; // 기본값

    // 상세 가격 정보가 있는 경우 분석
    if (model.details?.pricing_details) {
      const details = model.details.pricing_details;

      // 가격 유형에 따른 기본 점수
      if (details.pricing_type === 'free') {
        pricingScore = 10; // 무료 서비스
      } else if (details.pricing_type === 'subscription') {
        // 구독형 서비스의 경우 가장 저렴한 티어 가격 기준
        if (details.tiers && details.tiers.length > 0) {
          const cheapestTier = details.tiers.reduce((min: any, tier: any) =>
            (tier.price && (!min || tier.price < min.price)) ? tier : min, null);

          if (cheapestTier) {
            if (cheapestTier.price <= 10) pricingScore = 8;
            else if (cheapestTier.price <= 30) pricingScore = 6;
            else if (cheapestTier.price <= 60) pricingScore = 4;
            else pricingScore = 3;
          }
        }
      } else if (details.pricing_type === 'usage_based') {
        // 사용량 기반 서비스의 경우 토큰 가격 기준
        if (details.token_prices?.input?.price) {
          const inputPrice = details.token_prices.input.price;
          if (inputPrice < 1) pricingScore = 9;
          else if (inputPrice < 5) pricingScore = 7;
          else if (inputPrice < 10) pricingScore = 5;
          else if (inputPrice < 20) pricingScore = 4;
          else pricingScore = 3;
        } else if (details.image_prices) {
          // 이미지 생성 모델의 경우
          const prices = Object.values(details.image_prices);
          if (prices.length > 0) {
            const avgPrice = prices.reduce((sum: number, item: any) => sum + item.price, 0) / prices.length;
            if (avgPrice < 0.05) pricingScore = 8;
            else if (avgPrice < 0.1) pricingScore = 6;
            else pricingScore = 4;
          }
        }
      }

      // 무료 티어 보너스
      if (details.free_tier?.available) {
        pricingScore += 2;
      }

      // 컨텍스트 윈도우 크기 보너스 (더 큰 컨텍스트 = 더 좋은 가치)
      if (details.context_window?.size) {
        const contextSize = details.context_window.size;
        if (contextSize >= 100000) pricingScore += 1;
        if (contextSize >= 200000) pricingScore += 0.5;
      }
    } else {
      // 상세 가격 정보가 없는 경우 기본 텍스트 분석
      const pricingLower = model.pricing.toLowerCase();
      if (pricingLower.includes('무료') || pricingLower.includes('free')) {
        pricingScore = 10;
      } else if (pricingLower.includes('구독') || pricingLower.includes('subscription')) {
        pricingScore = 6;
      } else if (pricingLower.includes('api') || pricingLower.includes('사용량')) {
        pricingScore = 5;
      } else if (pricingLower.includes('enterprise') || pricingLower.includes('기업')) {
        pricingScore = 3;
      }
    }

    // 최종 점수 계산 (가중치 적용)
    const finalScore = (
      featuresScore * CRITERIA_WEIGHTS.FEATURES_COUNT +
      popularityScore * CRITERIA_WEIGHTS.POPULARITY +
      pricingScore * CRITERIA_WEIGHTS.PRICING_SCORE
    );

    // 최대 10점으로 제한
    return Math.min(parseFloat(finalScore.toFixed(1)), 10);
  };

  // 정렬 함수
  const sortModels = (a: AIModel, b: AIModel) => {
    let comparison = 0;

    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'popularity') {
      comparison = (a.popularity || 0) - (b.popularity || 0);
    } else if (sortBy === 'valueScore') {
      comparison = (a.valueScore || 0) - (b.valueScore || 0);
    }

    return sortDirection === 'desc' ? comparison * -1 : comparison;
  };

  // 정렬 방향 토글
  const toggleSort = (field: 'name' | 'popularity' | 'valueScore') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const sortedModels = [...models].sort(sortModels);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">AI 모델 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || models.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">{error || '비교할 모델이 없습니다.'}</h1>
          <Button asChild>
            <Link href="/ai-models">
              <ArrowLeft className="mr-2 h-4 w-4" />
              AI 모델 목록으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 상단 헤더 */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/ai-models">
            <ArrowLeft className="mr-2 h-4 w-4" />
            모델 선택으로 돌아가기
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">AI 모델 비교</h1>
            <p className="text-muted-foreground">선택한 {models.length}개 모델의 특징과 성능을 비교합니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('valueScore')}
              className="flex items-center gap-1"
            >
              가치 점수
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('popularity')}
              className="flex items-center gap-1"
            >
              인기도
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('name')}
              className="flex items-center gap-1"
            >
              이름
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 비교 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 bg-muted/50 sticky left-0">특성</th>
              {sortedModels.map((model) => (
                <th key={model.id} className="text-center p-4 min-w-[200px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-lg">{model.name}</span>
                    <span className="text-sm text-muted-foreground">{model.company}</span>
                    <Badge variant="outline" className="mt-1">{model.category}</Badge>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 가치 점수 */}
            <tr className="border-b bg-muted/20">
              <td className="p-4 font-medium bg-muted/50 sticky left-0">가치 점수</td>
              {sortedModels.map((model) => (
                <td key={model.id} className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-primary">{model.valueScore}/10</div>
                    <div className="text-xs text-muted-foreground mt-1">가성비 점수</div>
                  </div>
                </td>
              ))}
            </tr>

            {/* 인기도 */}
            <tr className="border-b">
              <td className="p-4 font-medium bg-muted/50 sticky left-0">인기도</td>
              {sortedModels.map((model) => (
                <td key={model.id} className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{model.popularity}/100</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* 출시일 */}
            <tr className="border-b">
              <td className="p-4 font-medium bg-muted/50 sticky left-0">출시일</td>
              {sortedModels.map((model) => (
                <td key={model.id} className="p-4 text-center">
                  {model.releaseDate}
                </td>
              ))}
            </tr>

            {/* 요금제 */}
            <tr className="border-b">
              <td className="p-4 font-medium bg-muted/50 sticky left-0">요금제</td>
              {sortedModels.map((model) => (
                <td key={model.id} className="p-4">
                  <div className="space-y-4">
                    {/* 기본 요금제 정보 */}
                    <div className="text-center">
                      <span className="font-medium">{model.pricing}</span>
                      {model.details?.pricing_details?.pricing_summary && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {model.details.pricing_details.pricing_summary}
                        </p>
                      )}
                    </div>

                    {/* 구독 티어 정보 */}
                    {model.details?.pricing_details?.pricing_type === 'subscription' && model.details?.pricing_details?.tiers && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">구독 티어</h4>
                        <div className="space-y-2">
                          {model.details.pricing_details.tiers.map((tier: any, idx: number) => (
                            <div key={idx} className="bg-muted/30 rounded p-2">
                              <div className="flex justify-between">
                                <span className="font-medium">{tier.name}</span>
                                <span className="text-primary">{tier.formatted}</span>
                              </div>
                              {tier.features && (
                                <p className="text-xs text-muted-foreground mt-1">{tier.features}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 토큰 가격 정보 */}
                    {model.details?.pricing_details?.token_prices && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">토큰 가격</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-muted/30 rounded p-2">
                            <div className="text-xs text-muted-foreground">입력 토큰</div>
                            <div className="font-medium">{model.details.pricing_details.token_prices.input.formatted}</div>
                          </div>
                          <div className="bg-muted/30 rounded p-2">
                            <div className="text-xs text-muted-foreground">출력 토큰</div>
                            <div className="font-medium">{model.details.pricing_details.token_prices.output.formatted}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 이미지 가격 정보 */}
                    {model.details?.pricing_details?.image_prices && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">이미지 가격</h4>
                        <div className="space-y-2">
                          {Object.entries(model.details.pricing_details.image_prices).map(([key, value]: [string, any]) => (
                            <div key={key} className="bg-muted/30 rounded p-2">
                              <div className="flex justify-between">
                                <span className="capitalize">{key}</span>
                                <span className="font-medium">{value.formatted}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{value.resolution}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 컨텍스트 윈도우 */}
                    {model.details?.pricing_details?.context_window && (
                      <div className="mt-3 bg-muted/30 rounded p-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">컨텍스트 윈도우</span>
                          <span className="font-medium">{model.details.pricing_details.context_window.formatted}</span>
                        </div>
                      </div>
                    )}

                    {/* 무료 티어 정보 */}
                    {model.details?.pricing_details?.free_tier && (
                      <div className="mt-3 bg-muted/30 rounded p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">무료 티어</span>
                          {model.details.pricing_details.free_tier.available ? (
                            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">제공</span>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded-full">없음</span>
                          )}
                        </div>
                        {model.details.pricing_details.free_tier.available && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {model.details.pricing_details.free_tier.description}
                          </p>
                        )}
                      </div>
                    )}

                    {/* 기업용 옵션 */}
                    {model.details?.pricing_details?.enterprise_options?.available && (
                      <div className="mt-3">
                        <div className="flex items-center gap-1">
                          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">기업용 옵션</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {model.details.pricing_details.enterprise_options.description}
                        </p>
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* 주요 기능 */}
            <tr className="border-b">
              <td className="p-4 font-medium bg-muted/50 sticky left-0">주요 기능</td>
              {sortedModels.map((model) => (
                <td key={model.id} className="p-4">
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {model.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* 강점 */}
            <tr className="border-b">
              <td className="p-4 font-medium bg-muted/50 sticky left-0">강점</td>
              {sortedModels.map((model) => (
                <td key={model.id} className="p-4">
                  {model.details?.strengths ? (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {model.details.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground text-sm">정보 없음</span>
                  )}
                </td>
              ))}
            </tr>

            {/* 한계 */}
            <tr className="border-b">
              <td className="p-4 font-medium bg-muted/50 sticky left-0">한계</td>
              {sortedModels.map((model) => (
                <td key={model.id} className="p-4">
                  {model.details?.limitations ? (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {model.details.limitations.map((limitation: string, index: number) => (
                        <li key={index}>{limitation}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground text-sm">정보 없음</span>
                  )}
                </td>
              ))}
            </tr>

            {/* 문서 링크 */}
            <tr className="border-b">
              <td className="p-4 font-medium bg-muted/50 sticky left-0">API 문서</td>
              {sortedModels.map((model) => (
                <td key={model.id} className="p-4 text-center">
                  {model.details?.api_documentation_url ? (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={model.details.api_documentation_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        문서 보기
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">정보 없음</span>
                  )}
                </td>
              ))}
            </tr>

            {/* 상세 페이지 링크 */}
            <tr>
              <td className="p-4 font-medium bg-muted/50 sticky left-0">상세 정보</td>
              {sortedModels.map((model) => (
                <td key={model.id} className="p-4 text-center">
                  <Button asChild>
                    <Link href={`/ai-models/${model.id}`}>
                      자세히 보기
                    </Link>
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
