/**
 * Firebase Admin SDK를 사용해 Firestore에 사용자 문서 생성
 *
 * 사용법:
 * 1. Firebase Console → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성
 * 2. 다운로드한 JSON 파일을 scripts/serviceAccountKey.json으로 저장
 * 3. npm install firebase-admin (이미 설치되어 있지 않다면)
 * 4. node scripts/seed-admin.js
 */

const admin = require('firebase-admin');
const path = require('path');

// 서비스 계정 키 경로
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'flower-63624',
  });
} catch (error) {
  console.error('❌ 서비스 계정 키를 찾을 수 없습니다!');
  console.log('\n📋 설정 방법:');
  console.log('1. Firebase Console(https://console.firebase.google.com) 접속');
  console.log('2. flower-63624 프로젝트 선택');
  console.log('3. 프로젝트 설정(톱니바퀴) → 서비스 계정 탭');
  console.log('4. "새 비공개 키 생성" 클릭 → JSON 다운로드');
  console.log('5. 다운로드한 파일을 scripts/serviceAccountKey.json으로 저장');
  console.log('6. 다시 실행: node scripts/seed-admin.js\n');
  process.exit(1);
}

const db = admin.firestore();
const auth = admin.auth();

async function seedUsers() {
  console.log('🚀 Firebase Admin SDK 초기화 완료\n');

  try {
    // Authentication에서 모든 사용자 가져오기
    const listUsersResult = await auth.listUsers(100);
    const users = listUsersResult.users;

    console.log(`📊 인증된 사용자 ${users.length}명 발견\n`);

    if (users.length === 0) {
      console.log('⚠️ 인증된 사용자가 없습니다.');
      return;
    }

    // 첫 번째 사용자를 관리자로 설정할지 확인
    const firstUser = users[0];
    console.log('👤 첫 번째 사용자를 관리자로 설정합니다:');
    console.log(`   - UID: ${firstUser.uid}`);
    console.log(`   - Email: ${firstUser.email}`);
    console.log(`   - Name: ${firstUser.displayName || '이름 없음'}\n`);

    // 모든 사용자를 Firestore에 추가
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const isFirstUser = i === 0;

      const userData = {
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: isFirstUser ? 'admin' : 'user', // 첫 번째 사용자만 admin
        createdAt: user.metadata.creationTime
          ? admin.firestore.Timestamp.fromDate(new Date(user.metadata.creationTime))
          : admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        totalOrders: 0,
        totalSpent: 0,
      };

      await db.collection('users').doc(user.uid).set(userData, { merge: true });

      const roleEmoji = isFirstUser ? '👑' : '👤';
      console.log(
        `${roleEmoji} ${user.email} → Firestore 저장 완료 (role: ${userData.role})`
      );
    }

    console.log('\n✅ 모든 사용자 데이터가 Firestore에 저장되었습니다!');
    console.log('\n📌 다음 단계:');
    console.log('1. Firebase Console → Firestore Database에서 users 컬렉션 확인');
    console.log('2. 관리자 페이지 /admin 접속 테스트');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    throw error;
  }
}

// 특정 사용자를 관리자로 변경
async function setAdmin(email) {
  try {
    const user = await auth.getUserByEmail(email);
    await db.collection('users').doc(user.uid).update({
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✅ ${email}이(가) 관리자로 설정되었습니다.`);
  } catch (error) {
    console.error(`❌ 오류: ${error.message}`);
  }
}

// 명령줄 인자 처리
const args = process.argv.slice(2);

if (args[0] === 'set-admin' && args[1]) {
  // node scripts/seed-admin.js set-admin user@email.com
  setAdmin(args[1]).then(() => process.exit(0));
} else {
  // 기본: 모든 사용자 시딩
  seedUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
