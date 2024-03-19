document.querySelector('#photo').addEventListener('change', function(e) {
  const files = e.target.files;
  const preview = document.getElementById('preview');

  preview.innerHTML = '';

  // 선택된 모든 파일에 대해 루프(현재는 단일파일만 가능하지만, 나중에 다중파일 선택 가능하도록 수정할 수 있음)
  Array.from(files).forEach(file => {
    // FileReader 인스턴스 생성
    const reader = new FileReader();

    // 파일 로딩 완료 시 이벤트 핸들러
    reader.onload = function(e) {
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
	document.querySelector('#markdown_preview').innerHTML = marked.parse(markdownText);
}

// preview_btn 버튼을 클릭할 때마다 변환을 업데이트
document.querySelector('#preview_btn').addEventListener('click', updatePreview);

// #markdown_preview_modal 클릭 시 모달창 닫기
document.querySelector('#markdown_preview_modal').addEventListener('click', function() {
	this.classList.add('hidden');
});

// #preview_btn 클릭 시 모달창 열기
document.querySelector('#preview_btn').addEventListener('click', function() {
	document.querySelector('#markdown_preview_modal').classList.remove('hidden');
});

// 초기 미리보기 업데이트
updatePreview();

// #delete_feed 버튼 클릭 시 confirm 창 띄우고 확인 시 삭제요청
document.querySelector('#delete_feed').addEventListener('click', function() {
  if (confirm('정말 삭제하시겠습니까?')) {
    const feedId = this.dataset.feedId;
    location.href = `/feed/delete/${feedId}`;
  }
});