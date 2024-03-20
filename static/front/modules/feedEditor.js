import { $ } from '../utils/dom.js';

const BASE_URL = 'http://192.168.1.175:5000/';
const SUCCESS = 'success';
const FAIL = 'fail';

document.querySelector('#photo').addEventListener('change', function (e) {
  const files = e.target.files;
  const preview = document.getElementById('preview');

  preview.innerHTML = '';

  // 선택된 모든 파일에 대해 루프(현재는 단일파일만 가능하지만, 나중에 다중파일 선택 가능하도록 수정할 수 있음)
  Array.from(files).forEach((file) => {
    // FileReader 인스턴스 생성
    const reader = new FileReader();

    // 파일 로딩 완료 시 이벤트 핸들러
    reader.onload = function (e) {
      // 이미지 태그 생성 및 소스 설정
      const img = new Image();
      img.src = e.target.result;

      // 이미지 스타일 설정
      img.style.width = '520px';
      img.style.height = '520px';
      img.style.objectFit = 'cover';

      // 미리보기 영역에 이미지 추가
      preview.appendChild(img);
    };

    reader.readAsDataURL(file);
  });
});

// 마크다운 입력을 HTML로 변환하고 미리보기를 업데이트하는 함수
function updatePreview() {
  const markdownText = document.getElementById('markdown-input').value;
  document.querySelector('#markdown_preview').innerHTML =
    marked.parse(markdownText);
}

// preview_btn 버튼을 클릭할 때마다 변환을 업데이트
document.querySelector('#preview_btn').addEventListener('click', updatePreview);

// #markdown_preview_modal 클릭 시 모달창 닫기
document
  .querySelector('#markdown_preview_modal')
  .addEventListener('click', function () {
    this.classList.add('hidden');
  });

// #preview_btn 클릭 시 모달창 열기
document.querySelector('#preview_btn').addEventListener('click', function () {
  document.querySelector('#markdown_preview_modal').classList.remove('hidden');
});

// 초기 미리보기 업데이트
updatePreview();

// #delete_feed 버튼 클릭 시 confirm 창 띄우고 확인 시 삭제요청
document.querySelector('#delete_feed').addEventListener('click', function () {
  if (confirm('정말 삭제하시겠습니까?')) {
    const feedId = this.dataset.feedId;
    location.href = `/feed/delete/${feedId}`;
  }
});

const handleClickUpload = async (e) => {};

const uploadFeed = () => {
  const $feedEditorForm = $('.feed-editor-form');
  const $uploadBtn = $('.feed-upload-btn');

  $uploadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const [tokenCookie] = decodeURIComponent(document.cookie).split('; ');
    const [_, token] = tokenCookie.split('=');
    const formData = new FormData($feedEditorForm);

    try {
      const res = await fetch(`${BASE_URL}api/feed`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();

        if ((data.result = SUCCESS)) {
          alert('업로드 성공 !');
          // addtional : 업로드하면 피드 디테일 페이지로 이동
          window.location.href = '/feed';
        } else {
          alert('서버에 문제가 생겨 파일을 업로드 하지 못했습니다.');
        }
      }
    } catch (error) {
      alert('서버에 문제가 생겨 파일을 업로드 하지 못했습니다.');
    }
  });
};

uploadFeed();
