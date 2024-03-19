from pymongo import MongoClient

from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.jungle

# HTML 화면 보여주기
@app.route('/')
def home():
    return render_template('index.html',name = "테스터")


admin_id = "Minsu"
admin_pw = "123456"
SECRET_KEY = 'apple'

# 회원가입
@app.route("/signin", methods=['POST'])
def signin_proc():
    # 요청 내용 파싱 
	print(request.form)
	input_data = request.form
	user_id = input_data['user_id']
	user_password = input_data['user_password']
	user_name = input_data['user_name']
 
    # 아이디 중복 조회
	find_user_id = db.users.find_one({'user_id': user_id})
	print(user_id)
 
	user ={
		'user_id': user_id,
    	'user_password':user_password,
    	'user_name' :user_name
	}
	#return jsonify({'result': 'success', 'user': user})
	# 중복되는 아이디가 없을경우
	if (find_user_id == None):
		print("중복 아이디 없음")
		db.users.insert_one(user)
		return jsonify({'result': 'success', 'message': '등록 완료'})

	# 아이디, 비밀번호가 일치하지 않는 경우
	else:
		return jsonify({'result': 'fail','message':'아이디 중복됨'})


# 로그인
@app.route("/login", methods=['POST'])
def login_proc():
	print(request.form)
	input_data = request.form
	user_id = input_data['user_id']
	user_password = input_data['user_password']

	# 아이디, 비밀번호가 일치하는 경우
	if (user_id == admin_id and
			user_password == admin_pw):
		payload = {
			'id': user_id,
			'exp': datetime.utcnow() + timedelta(seconds=60)  # 로그인 24시간 유지
		}
		token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

		return jsonify({'result': 'success', 'token': token})


	# 아이디, 비밀번호가 일치하지 않는 경우
	else:
		return jsonify({'result': 'fail'})



# # API 역할을 하는 부분
# @app.route('/api/list', methods=['GET'])
# def show_stars():
#     # 1. db에서 mystar 목록 전체를 검색합니다. ID는 제외하고 like 가 많은 순으로 정렬합니다.
#     # 참고) find({},{'_id':False}), sort()를 활용하면 굿!
#     stars = list(db.mystar.find({}, {'_id': False}).sort('like', -1))
#     # 2. 성공하면 success 메시지와 함께 stars_list 목록을 클라이언트에 전달합니다.
#     return jsonify({'result': 'success', 'stars_list': stars})


# @app.route('/api/like', methods=['POST'])
# def like_star():
#     # 1. 클라이언트가 전달한 name_give를 name_receive 변수에 넣습니다.
#     name_receive = request.form['name_give']

#     # 2. mystar 목록에서 find_one으로 name이 name_receive와 일치하는 star를 찾습니다.
#     star = db.mystar.find_one({'name': name_receive})
#     # 3. star의 like 에 1을 더해준 new_like 변수를 만듭니다.
#     new_like = star['like'] + 1

#     # 4. mystar 목록에서 name이 name_receive인 문서의 like 를 new_like로 변경합니다.
#     # 참고: '$set' 활용하기!
#     db.mystar.update_one({'name': name_receive}, {'$set': {'like': new_like}})

#     # 5. 성공하면 success 메시지를 반환합니다.
#     return jsonify({'result': 'success'})


# @app.route('/api/delete', methods=['POST'])
# def delete_star():
#     # 1. 클라이언트가 전달한 name_give를 name_receive 변수에 넣습니다.
#     name_receive = request.form['name_give']
#     # 2. mystar 목록에서 delete_one으로 name이 name_receive와 일치하는 star를 제거합니다.
#     db.mystar.delete_one({'name': name_receive})
#     # 3. 성공하면 success 메시지를 반환합니다.
#     return jsonify({'result': 'success'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)