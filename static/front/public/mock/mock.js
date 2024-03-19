export const mock = Array.from({ length: 30 }, () => ({
  imageUrl: 'https://via.placeholder.com/200x140',
  content:
    '안녕하세요 반갑습니다 안녕히가세요안녕히가세요안녕히가세요안녕히가세요안녕히가세요안녕히가세요안녕히가세요안녕히가세요안녕히가세요안녕히가세요안녕히가세요안녕히가세요안녕히가세요안녕히가세요',
}));

// 인스타 피드 상세 목업 데이터
export const detailMock = {
  "user_id": null,
	"user_name" :null,
	"detail" : `# This is a H1
	## This is a H2
	### This is a H3
	#### This is a H4
	##### This is a H5
	###### This is a H6
	
	asdf
	asdf
	asdfasd`,
	"images" : [
		"https://via.placeholder.com/200x140",
		"https://via.placeholder.com/200x140",
		"https://via.placeholder.com/200x140"
	]
};