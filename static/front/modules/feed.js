document.getElementById('photo').addEventListener('change', function(e) {
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
      img.style.width = '420px';
      img.style.height = '420px';
			img.style.objectFit = 'cover';
			
      // 미리보기 영역에 이미지 추가
      preview.appendChild(img);
    };
		
    reader.readAsDataURL(file);
  });
});
