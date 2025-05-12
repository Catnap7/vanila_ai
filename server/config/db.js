const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB 연결 시도
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB 연결 성공: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB 연결 오류: ${error.message}`);
    console.log('메모리 내 데이터베이스를 사용합니다.');
    return false;
  }
};

module.exports = connectDB;
