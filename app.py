import jwt
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder="static")
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

client = MongoClient("localhost", 27017)
db = client.jungle

SECRET_KEY = "jungle"

# @app.route('/<name>')
# def hello(name):
#     return render_template('index.html', name=name)


## 주소
# 메인화면
@app.route("/feed")
def home():
    return render_template("index.html", name="테스터")


# 회원가임
@app.route("/user/signup")
def page_signup():
    return render_template("signInPage.html", name="테스터")


# 로그인
@app.route("/user/login")
def page_login():
    return render_template("logInPage.html", name="테스터")


# 피드 상세보기
@app.route("/feed/detail/<number>")
def feed_detail(number):
    detail = f"""# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6# This is a H1\n## This is a H2\n### This is a H3\n#### This is a H4\n##### This is a H5\n###### This is a H6"""
    return render_template(
        "feedDetail.html",
        name="테스터",
        image="https://via.placeholder.com/520x520",
        detail=detail,
    )


# 피드 작성
@app.route("/feed/editor")
def feed():
    return render_template("feedEditor.html", name="테스터")


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
    # 아이디 중복 조회
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
    print(request.json)
    user_id = request.json["user_id"]
    user_password = request.json["user_password"]
    # 가입 여부 확인
    find_user = db.users.find_one({"user_id": user_id})
    print(find_user)

    # 미가입
    if find_user == None:
        print("미가입 아이디")
        return jsonify({"result": "fail", "message": "미가입 아이디"})
    # 아이디, 비밀번호가 일치하는 경우
    elif (
        find_user["user_id"] == user_id and find_user["user_password"] == user_password
    ):
        payload = {
            "user_id": user_id,
            # 'exp': datetime.utcnow() + timedelta(seconds=60)  # 로그인 24시간 유지
        }
        # 토큰 생성
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return jsonify(
            {"result": "success", "user_name": find_user["user_name"], "token": token}
        )
    # 아이디, 비밀번호가 일치하지 않는 경우
    else:
        return jsonify({"result": "fail", "message": "로그인 실패"})


## 피드 등록
@app.route("/api/feed", methods=["POST"])
def feed_upload_proc():
    # 요청 내용 파싱
    print(request.json)
    detail = request.json["detail"]
    # image = request.json["image"]

    # 토큰 검증
    token = request.headers.get("Authorization")  # Authorization 헤더로 담음
    find_user = tokenVerification(token)
    if find_user == False:
        return jsonify({"result": "fail", "message": "토큰 검증 실패"})

    feed = {
        "user_id": find_user["user_id"],
        "user_name": find_user["user_name"],
        "detail": detail,
        "image": "http://192.168.1.175:5000/static/images/test.jpeg",
    }
    db.feeds.insert_one(feed)
    return jsonify({"result": "success", "message": "성공"})


## 피드 조회
@app.route("/api/feed", methods=["GET"])
def read_feeds():
    db_result = list(db.feeds.find())
    for item in db_result:
        item["_id"] = str(item["_id"])

    if db_result == None:
        return jsonify({"result": "fail", "message": "피드 조회 실패"})
    else:
        return jsonify({"result": "success", "message": db_result})


## 피드 상세 조회
@app.route("/api/feed/detail/<arg>", methods=["GET"])
def read_feed_detail(arg):
    db_result = db.feeds.find_one({"_id": ObjectId(arg)})
    db_result["_id"] = str(db_result["_id"])
    if db_result == None:
        return jsonify({"result": "fail", "message": "피드 조회 실패"})
    else:
        return jsonify({"result": "success", "message": db_result})


## 내 피드 조회
@app.route("/api/feed/my", methods=["GET"])
def read_my_feeds():

    # 토큰 검증
    token = request.headers.get("Authorization")  # Authorization 헤더로 담음
    find_user = tokenVerification(token)
    if find_user == False:
        return jsonify({"result": "fail", "message": "토큰 검증 실패"})

    # 내 피드 검색
    db_result = list(db.feeds.find({"user_id": find_user["user_id"]}))
    for item in db_result:
        item["_id"] = str(item["_id"])
    if db_result == None:
        return jsonify({"result": "fail", "message": "피드 조회 실패"})
    else:
        return jsonify({"result": "success", "message": db_result})


# API 역할을 하는 부분
@app.route("/api/jwt/test", methods=["GET"])
def jwtTest():
    token = request.headers.get("Authorization")  # Authorization 헤더로 담음
    # 토큰 검증
    find_user = tokenVerification(token)
    print("token_result :")
    print(find_user)
    if find_user == False:
        return jsonify({"result": "fail", "message": "토큰 검증 실패"})
    else:
        return jsonify({"result": "success", "message": "성공"})


# 토큰 검증
def tokenVerification(token):
    try:
        # 토큰 디코딩
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms="HS256")
        # 가입 여부 확인
        find_user = db.users.find_one({"user_id": decoded_token["user_id"]})
        if find_user == None:
            return False
        else:
            return find_user
    except:
        return False


# 몽고디비 테스트 함수
@app.route("/api/db/test", methods=["GET"])
def dbTest():
    db_result = list(db.feeds.find())
    print(db_result)
    new_data = [{k: v for k, v in item.items() if k != "_id"} for item in db_result]
    if new_data == None:
        return jsonify({"result": "fail", "message": "토큰 검증 실패"})
    else:
        return jsonify({"result": "success", "message": new_data})


if __name__ == "__main__":
    app.run("0.0.0.0", port=5000, debug=True)
