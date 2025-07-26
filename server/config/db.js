const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas 연결 옵션 설정
    const options = {
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10, // 최대 연결 풀 크기
      serverSelectionTimeoutMS: parseInt(process.env.DB_TIMEOUT) || 10000, // 서버 선택 타임아웃
      socketTimeoutMS: 45000, // 소켓 타임아웃
      family: 4, // IPv4 사용
    };

    // MongoDB Atlas 연결 시도
    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Atlas 연결 성공!`);
    console.log(`   - 호스트: ${conn.connection.host}`);
    console.log(`   - 데이터베이스: ${conn.connection.name}`);
    console.log(`   - 연결 상태: ${conn.connection.readyState === 1 ? '연결됨' : '연결 안됨'}`);

    // 연결 이벤트 리스너 설정
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB 연결 오류:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB 연결이 끊어졌습니다.');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB 재연결 성공');
    });

    return true;
  } catch (error) {
    console.error(`❌ MongoDB Atlas 연결 실패: ${error.message}`);

    // 상세한 오류 정보 출력
    if (error.name === 'MongoServerSelectionError') {
      console.error('   - 서버 선택 오류: MongoDB Atlas 클러스터에 연결할 수 없습니다.');
      console.error('   - 네트워크 연결 및 IP 화이트리스트를 확인하세요.');
    } else if (error.name === 'MongoParseError') {
      console.error('   - 연결 문자열 파싱 오류: MONGO_URI 형식을 확인하세요.');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('   - 인증 오류: 사용자명과 비밀번호를 확인하세요.');
    }

    console.log('📝 메모리 내 데이터베이스를 사용합니다.');
    return false;
  }
};

// 연결 종료 함수
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB 연결이 정상적으로 종료되었습니다.');
  } catch (error) {
    console.error('MongoDB 연결 종료 중 오류:', error);
  }
};

// Graceful shutdown 처리
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };
