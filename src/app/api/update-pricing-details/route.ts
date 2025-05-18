import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 개선된 가격 정보 데이터
const updatedPricingDetails = [
  {
    model_id: 1, // GPT-4o
    pricing_details: {
      pricing_type: "usage_based",
      pricing_summary: "API 사용량 기반 과금, 토큰당 비용 차등 적용",
      tiers: [
        {
          name: "Pay-as-you-go",
          description: "사용한 만큼만 지불하는 기본 요금제"
        }
      ],
      token_prices: {
        input: {
          price: 10.0,
          unit: "USD per 1M tokens",
          formatted: "$10 / 1M 토큰"
        },
        output: {
          price: 30.0,
          unit: "USD per 1M tokens",
          formatted: "$30 / 1M 토큰"
        }
      },
      context_window: {
        size: 128000,
        unit: "tokens",
        formatted: "128K 토큰"
      },
      free_tier: {
        available: true,
        description: "ChatGPT Plus 구독자($20/월)는 GPT-4o에 제한적 접근 가능",
        limits: "일일 메시지 제한 있음"
      },
      enterprise_options: {
        available: true,
        description: "대규모 사용량에 대한 볼륨 할인 제공",
        contact_url: "https://openai.com/enterprise"
      },
      additional_info: "2024년 5월 기준 가격. 대용량 사용자는 볼륨 할인 가능."
    }
  },
  {
    model_id: 2, // Claude 3 Opus
    pricing_details: {
      pricing_type: "usage_based",
      pricing_summary: "API 사용량 기반 과금, 입출력 토큰 비용 차등 적용",
      tiers: [
        {
          name: "Pay-as-you-go",
          description: "사용한 만큼만 지불하는 기본 요금제"
        }
      ],
      token_prices: {
        input: {
          price: 15.0,
          unit: "USD per 1M tokens",
          formatted: "$15 / 1M 토큰"
        },
        output: {
          price: 75.0,
          unit: "USD per 1M tokens",
          formatted: "$75 / 1M 토큰"
        }
      },
      context_window: {
        size: 200000,
        unit: "tokens",
        formatted: "200K 토큰"
      },
      free_tier: {
        available: false,
        description: "무료 티어 없음",
        limits: "N/A"
      },
      enterprise_options: {
        available: true,
        description: "기업용 맞춤 요금제 및 볼륨 할인 제공",
        contact_url: "https://www.anthropic.com/enterprise"
      },
      additional_info: "2024년 5월 기준 가격. Claude 3 Sonnet, Haiku 등 더 저렴한 모델 옵션 있음."
    }
  },
  {
    model_id: 3, // Midjourney v6
    pricing_details: {
      pricing_type: "subscription",
      pricing_summary: "월간 구독제, 티어별 이미지 생성 수량 차등 적용",
      tiers: [
        {
          name: "Basic",
          price: 10,
          unit: "USD per month",
          formatted: "$10/월",
          features: "월 200분의 GPU 시간, 기본 기능 접근"
        },
        {
          name: "Standard",
          price: 30,
          unit: "USD per month",
          formatted: "$30/월",
          features: "월 15시간의 GPU 시간, 더 빠른 생성 속도"
        },
        {
          name: "Pro",
          price: 60,
          unit: "USD per month",
          formatted: "$60/월",
          features: "월 30시간의 GPU 시간, 프라이빗 모드, 우선 처리"
        },
        {
          name: "Mega",
          price: 120,
          unit: "USD per month",
          formatted: "$120/월",
          features: "월 60시간의 GPU 시간, 최고 우선순위, 모든 기능 접근"
        }
      ],
      free_tier: {
        available: false,
        description: "무료 티어 없음",
        limits: "N/A"
      },
      enterprise_options: {
        available: true,
        description: "기업용 맞춤 요금제 제공",
        contact_url: "https://www.midjourney.com/enterprise"
      },
      additional_info: "2024년 5월 기준 가격. Discord를 통해서만 접근 가능."
    }
  },
  {
    model_id: 4, // Gemini Pro
    pricing_details: {
      pricing_type: "usage_based",
      pricing_summary: "API 사용량 기반 과금, 토큰당 비용 차등 적용",
      tiers: [
        {
          name: "Pay-as-you-go",
          description: "사용한 만큼만 지불하는 기본 요금제"
        }
      ],
      token_prices: {
        input: {
          price: 0.5,
          unit: "USD per 1M tokens",
          formatted: "$0.5 / 1M 토큰"
        },
        output: {
          price: 1.5,
          unit: "USD per 1M tokens",
          formatted: "$1.5 / 1M 토큰"
        }
      },
      context_window: {
        size: 32768,
        unit: "tokens",
        formatted: "32K 토큰"
      },
      free_tier: {
        available: true,
        description: "매월 $10 상당의 무료 크레딧 제공",
        limits: "월간 크레딧 한도 내에서 사용 가능"
      },
      enterprise_options: {
        available: true,
        description: "Google Cloud AI 솔루션을 통한 기업용 요금제",
        contact_url: "https://cloud.google.com/ai"
      },
      additional_info: "2024년 5월 기준 가격. Gemini 1.5 Pro/Flash 등 다양한 모델 옵션 있음."
    }
  },
  {
    model_id: 5, // DALL-E 3
    pricing_details: {
      pricing_type: "usage_based",
      pricing_summary: "이미지 생성당 비용 부과, 해상도별 차등 적용",
      tiers: [
        {
          name: "Pay-as-you-go",
          description: "사용한 만큼만 지불하는 기본 요금제"
        }
      ],
      image_prices: {
        standard: {
          price: 0.04,
          unit: "USD per image",
          formatted: "$0.04 / 이미지",
          resolution: "1024x1024"
        },
        hd: {
          price: 0.08,
          unit: "USD per image",
          formatted: "$0.08 / 이미지",
          resolution: "1792x1024"
        }
      },
      free_tier: {
        available: true,
        description: "ChatGPT Plus 구독자($20/월)는 제한된 수의 이미지 생성 가능",
        limits: "일일 이미지 생성 수 제한 있음"
      },
      enterprise_options: {
        available: true,
        description: "대규모 사용량에 대한 볼륨 할인 제공",
        contact_url: "https://openai.com/enterprise"
      },
      additional_info: "2024년 5월 기준 가격. API를 통해 이미지 생성 가능."
    }
  }
];

export async function GET() {
  try {
    // 각 모델의 가격 정보 업데이트
    const results = await Promise.all(
      updatedPricingDetails.map(async (item) => {
        const { data, error } = await supabase
          .from('ai_model_details')
          .update({ pricing_details: item.pricing_details })
          .eq('model_id', item.model_id)
          .select();
        
        return {
          model_id: item.model_id,
          success: !error,
          data,
          error
        };
      })
    );
    
    // 업데이트 결과 확인
    const failedUpdates = results.filter(result => !result.success);
    
    if (failedUpdates.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: '일부 모델의 가격 정보 업데이트에 실패했습니다.', 
        results 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '모든 모델의 가격 정보가 성공적으로 업데이트되었습니다.', 
      results 
    });
  } catch (error) {
    console.error('API 라우트 실행 중 오류 발생:', error);
    return NextResponse.json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.', 
      error 
    }, { status: 500 });
  }
}
