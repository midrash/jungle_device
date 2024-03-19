import jwt
from pymongo import MongoClient
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder="static")
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

client = MongoClient("localhost", 27017)
db = client.jungle

SECRET_KEY = 'jungle'

## 주소
# HTML 화면 보여주기
@app.route("/")
def home():
  return render_template("index.html", name="테스터")

# @app.route('/<name>')
# def hello(name):
#     return render_template('index.html', name=name)

@app.route("/signup")
def page_signup():
  return render_template("signInPage.html", name="테스터")

@app.route("/feed")
def feed():
  return render_template("feed.html", name="테스터")

@app.route("/feed_detail")
def feed_():
  detail = f"""# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6"""
  return render_template("feedDetail.html", name="테스터", image="https://via.placeholder.com/520x520", detail=detail)

## api
# 회원가입
@app.route("/api/signup", methods=["POST"])
def signup_proc():
  #   # 요청 내용 파싱
#   print(request.form)
#   input_data = request.form
#   user_id = input_data["user_id"]
#   user_password = input_data["user_password"]
#   user_name = input_data["user_name"]
  print(request.json)
  user_id = request.json["user_id"]
  user_password = request.json["user_password"]
  user_name = request.json["user_name"]
  # return jsonify({"result": "success", "user": user})
  # # 아이디 중복 조회
  find_user = db.users.find_one({"user_id": user_id})
  print(find_user)
  user = {"user_id": user_id, "user_password": user_password, "user_name": user_name}
  # return jsonify({'result': 'success', 'user': user})
  # 중복되는 아이디가 없을경우
  if find_user == None:
    print("중복 아이디 없음")
    db.users.insert_one(user)
    return jsonify({"result": "success", "message": "등록 완료"})

  # 아이디, 비밀번호가 일치하지 않는 경우
  else:
    return jsonify({"result": "fail", "message": "아이디 중복됨"})

# 로그인
@app.route("/api/login", methods=["POST"])
def login_proc():
  # 요청 내용 파싱
  print(request.form)
  input_data = request.form
  user_id = input_data["user_id"]
  user_password = input_data["user_password"]

  # 가입 여부 확인
  find_user = db.users.find_one({"user_id": user_id})
  print(find_user)

  # 미가입
  if (find_user == None): 
    print("미가입 아이디")
    return jsonify({'result': 'fail','message':'미가입 아이디'})
  # 아이디, 비밀번호가 일치하는 경우
  elif (find_user['user_id'] == user_id and find_user['user_password'] == user_password):
    payload = {
      'user_id': user_id,
      # 'exp': datetime.utcnow() + timedelta(seconds=60)  # 로그인 24시간 유지
    }
    # 토큰 생성
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return jsonify({'result': 'success', 'token': token})
  # 아이디, 비밀번호가 일치하지 않는 경우
  else:
    return jsonify({'result': 'fail','message':'로그인 실패'})



# API 역할을 하는 부분
@app.route('/api/jwt/test', methods=['GET'])
def jwtTest():
  header = request.headers.get('Authorization')  # Authorization 헤더로 담음
  # 토큰 검증 
  token_result = tokenVerification(header)
  
  if token_result == False:
    return jsonify({'result': 'false', 'message': "토큰 검증 실패"})
  else:
    return jsonify({'result': 'success', 'message': "토큰 검증 성공"})


def tokenVerification(token):
  try:
    # 토큰 디코딩
    decoded_token = jwt.decode(token,SECRET_KEY,algorithms='HS256')
    # 가입 여부 확인
    find_user = db.users.find_one({"user_id": decoded_token['user_id']})
    if find_user == None:
      return False
    else:
      return True
  except:
    return False

if __name__ == "__main__":
  app.run("0.0.0.0", port=5000, debug=True)

