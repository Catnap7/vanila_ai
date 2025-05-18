'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiModelsApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AIModel {
  id: number;
  name: string;
  category: string;
  company: string;
}

export default function ModelCompareSelector() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModels, setSelectedModels] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const data = await aiModelsApi.getAll();
        setModels(data);
      } catch (error) {
        console.error('모델 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleModelToggle = (modelId: number) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else {
        // 최대 4개까지만 선택 가능
        if (prev.length >= 4) {
          return prev;
        }
        return [...prev, modelId];
      }
    });
  };

  const handleCompare = () => {
    if (selectedModels.length < 2) {
      alert('비교하려면 최소 2개 이상의 모델을 선택해야 합니다.');
      return;
    }

    // 선택된 모델 ID를 쿼리 파라미터로 전달
    const queryParams = selectedModels.map(id => `models=${id}`).join('&');

    // 현재 URL에 타임스탬프를 추가하여 항상 새로운 URL로 이동하도록 함
    // 이렇게 하면 Next.js가 페이지를 새로 로드하게 됨
    const timestamp = Date.now();
    router.push(`/ai-models/compare?${queryParams}&_t=${timestamp}`);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">AI 모델을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">AI 모델 비교</h2>
          <p className="text-muted-foreground">비교할 모델을 선택하세요 (최대 4개)</p>
        </div>
        <Button
          onClick={handleCompare}
          disabled={selectedModels.length < 2}
          className="w-full sm:w-auto"
        >
          {selectedModels.length < 2
            ? '최소 2개 이상 선택하세요'
            : `${selectedModels.length}개 모델 비교하기`}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {models.map((model) => (
          <Card
            key={model.id}
            className={`cursor-pointer transition-all ${
              selectedModels.includes(model.id)
                ? 'border-primary ring-2 ring-primary/20'
                : 'hover:border-primary/50'
            }`}
            onClick={() => handleModelToggle(model.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedModels.includes(model.id)}
                    onCheckedChange={() => handleModelToggle(model.id)}
                    className="mt-1"
                  />
                  <div>
                    <h3 className="font-medium">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.company}</p>
                  </div>
                </div>
                <Badge variant="outline">{model.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedModels.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button onClick={handleCompare} size="lg">
            {selectedModels.length} 개 모델 비교하기
          </Button>
        </div>
      )}
    </div>
  );
}
