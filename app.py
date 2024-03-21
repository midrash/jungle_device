import jwt
import datetime

from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
from flask import Flask, render_template, jsonify, request, make_response
from flask_cors import CORS, cross_origin


app = Flask(__name__, static_folder="static")
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

client = MongoClient("192.168.1.175", 27017)
db = client.jungle

SECRET_KEY = "jungle"
BASE_URL = "http://192.168.1.175:5000/"
# @app.route('/<name>')
# def hello(name):
#     return render_template('index.html', name=name)


## 주소
# 메인화면
@app.route("/feed", methods=["GET"])
def home():
    # 토큰 검증
    token = request.headers.get("Authorization")  # Authorization 헤더로 담음
    token = request.cookies.get("token")
    print("토큰이에오")
    print(token)
    find_user = tokenVerification(token)
    print(find_user)
    if find_user == False:
        return render_template("index.html", name="테스터", is_loged_in=False)
    else:
        return render_template(
            "index.html", name=find_user["user_name"], is_loged_in=True
        )


# 회원가임
@app.route("/user/signup")
def page_signup():
    return render_template("signInPage.html", name="테스터")


# 로그인
@app.route("/user/login")
def page_login():
    return render_template("loginPage.html", name="테스터")


# 피드 상세보기
@app.route("/feed/detail/<number>")
def feed_detail(number):
    db_result = db.feeds.find_one({"_id": ObjectId(number)})
    if db_result == None:
        return render_template("index.html", name="테스터")
    else:
        db_result["_id"] = str(db_result["_id"])
        db_result["image"] = BASE_URL + db_result["image"]
        return render_template(
            "feedDetail.html",
            name=db_result["user_name"],
            image=db_result["image"],
            detail=db_result["detail"],
            product=db_result["product"],
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
    # # 토큰 검증
    token = request.headers.get("Authorization")  # Authorization 헤더로 담음
    print("token")
    print(token)
    find_user = tokenVerification(token)
    if find_user == False:
        return jsonify({"result": "fail", "message": "토큰 검증 실패"})

    # 요청 내용 파싱
    print(request.form)
    print(request.files)
    file = request.files["image"]
    input_data = request.form
    detail = input_data["detail"]
    product = input_data["product"]
    # 파일 업로드
    file_path = uploade_file(file)
    if file_path == False:
        return jsonify({"result": "fail", "message": "파일 업로드 실패"})

    feed = {
        "user_id": find_user["user_id"],
        "user_name": find_user["user_name"],
        "detail": detail,
        "image": file_path,
        "groupbuy": False,
        "like": 0,
        "product": product,
    }
    db.feeds.insert_one(feed)
    return jsonify({"result": "success", "message": "성공"})


# ## 피드 수정
# @app.route("/api/feed/<arg>", methods=["PUT"])
# def feed_update_proc(arg):
#     # 토큰 검증
#     token = request.headers.get("Authorization")  # Authorization 헤더로 담음
#     find_user = tokenVerification(token)
#     if find_user == False:
#         return jsonify({"result": "fail", "message": "토큰 검증 실패"})

#     # 요청 내용 파싱
#     file = request.files["image"]
#     input_data = request.form
#     detail = input_data["detail"]
#     # 파일 업로드
#     file_path = uploade_file(file)
#     if file_path == False:
#         return jsonify({"result": "fail", "message": "파일 업로드 실패"})

#     feed = {
#         "detail": detail,
#         "image": file_path,
#     }
#     db.feeds.update_one({"_id": ObjectId(arg)}, {"$set": feed})
#     return jsonify({"result": "success", "message": "성공"})


## 피드 삭제
@app.route("/api/feed", methods=["DELETE"])
def feed_delete_proc():
    # 토큰 검증
    token = request.headers.get("Authorization")  # Authorization 헤더로 담음
    find_user = tokenVerification(token)
    if find_user == False:
        return jsonify({"result": "fail", "message": "토큰 검증 실패"})
    # 요청 내용 파싱
    print(request.json)
    id = request.json["id"]
    db_result = db.feeds.find_one({"_id": ObjectId(id)})
    print(db_result["user_id"])
    print(find_user["user_id"])
    if db_result["user_id"] == find_user["user_id"]:
        db.feeds.delete_one({"_id": ObjectId(id)})
        return jsonify({"result": "success", "message": "삭제 완료"})
    else:
        return jsonify({"result": "fail", "message": "해당 유저의 피드 아님"})


## 공구 모집
@app.route("/api/feed/groupbuy/<arg>", methods=["PUT"])
def feed_groupbuy_proc(arg):
    # 토큰 검증
    token = request.headers.get("Authorization")  # Authorization 헤더로 담음
    token = request.cookies.get("token")
    print("토큰이에오")
    print(token)
    find_user = tokenVerification(token)
    # if find_user == False:
    #     return jsonify({"result": "fail", "message": "토큰 검증 실패"})

    print(request.json)
    contact = request.json["contact"]
    link = request.json["link"]
    feed = {
        "groupbuy": True,
        "representative": find_user["user_name"],
        "contact": contact,
        "link": link,
    }
    db.feeds.update_one({"_id": ObjectId(arg)}, {"$set": feed})
    return jsonify({"result": "success", "message": "성공"})


## 피드 조회
@app.route("/api/feed", methods=["GET"])
def read_feeds():

    # 토큰 검증
    token = request.headers.get("Authorization")  # Authorization 헤더로 담음
    db_result = list(
        db.feeds.find(
            {},
            {
                "_id": 1,
                "user_id": 1,
                "user_name": 1,
                "detail": 1,
                "image": 1,
                "like": 1,
                "product": 1,
            },
        )
    )
    for item in db_result:
        item["_id"] = str(item["_id"])
        item["image"] = BASE_URL + item["image"]
    if db_result == None:
        return jsonify({"result": "fail", "message": "피드 조회 실패"})
    else:
        find_user = tokenVerification(token)
        if find_user == False:
            return jsonify({"result": "success", "message": db_result})
        else:
            return jsonify(
                {
                    "result": "success",
                    "is_loged_in": True,
                    "user_name": find_user["user_name"],
                    "message": db_result,
                }
            )


## 피드 상세 조회
@app.route("/api/feed/detail/<arg>", methods=["GET"])
def read_feed_detail(arg):

    token = request.headers.get("Authorization")  # Authorization 헤더로 담음
    db_result = db.feeds.find_one({"_id": ObjectId(arg)})
    db_result["_id"] = str(db_result["_id"])
    db_result["image"] = BASE_URL + db_result["image"]
    if db_result == None:
        return jsonify({"result": "fail", "message": "피드 조회 실패"})
    else:
        find_user = tokenVerification(token)
        if find_user["user_id"] == db_result["user_id"]:
            db_result["my"] = True
            return jsonify({"result": "success", "message": db_result})
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
    db_result = list(
        db.feeds.find(
            {"user_id": find_user["user_id"]},
            {
                "_id": 1,
                "user_id": 1,
                "user_name": 1,
                "detail": 1,
                "image": 1,
                "like": 1,
                "product": 1,
            },
        )
    )
    for item in db_result:
        item["_id"] = str(item["_id"])
        item["image"] = BASE_URL + item["image"]
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
    if token == None:
        return False
    else:
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


# 파일 업로드
def uploade_file(file):
    try:
        time = datetime.datetime.now()
        timestemp = (
            str(time.year)
            + str(time.month)
            + str(time.day)
            + str(time.hour)
            + str(time.minute)
            + str(time.microsecond)
        )
        filename = (
            file.filename.rsplit(".", 1)[0]
            + timestemp
            + "."
            + file.filename.rsplit(".", 1)[1]
        )
        print(filename)
        filePath = "/static/images/" + secure_filename(filename)
        file.save("." + filePath)
        return filePath
    except:
        return False


# # 이미지 업로드
# @app.route("/file/uploader", methods=["POST"])
# def uploader_file():
#     try:
#         time = datetime.datetime.now()
#         file = request.files["image"]
#         timestemp = (
#             str(time.year)
#             + str(time.month)
#             + str(time.day)
#             + str(time.hour)
#             + str(time.minute)
#             + str(time.microsecond)
#         )
#         filename = (
#             file.filename.rsplit(".", 1)[0]
#             + timestemp
#             + "."
#             + file.filename.rsplit(".", 1)[1]
#         )
#         print(filename)
#         filePath = "/static/images/" + secure_filename(filename)
#         file.save("." + filePath)
#         return jsonify({"result": "success", "filePath": filePath})
#     except:
#         return jsonify({"result": "fail", "message": "파일 업로드 실패"})


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


@app.route("/token", methods=["GET"])
def get_name_from_token():
    # 토큰 검증
    token = request.headers.get("Authorization")  # Authorization 헤더로 담음
    print(token)
    find_user = tokenVerification(token)
    print(find_user)
    if find_user == False:
        return jsonify({"result": "fail", "message": "토큰 검증 실패"})

    # 내 피드 검색
    db_result = db.feeds.find_one(
        {"user_id": find_user["user_id"]},
        {"_id": 0, "user_name": 1},
    )

    if db_result == None:
        return jsonify({"result": "fail", "message": "피드 조회 실패"})
    else:
        return jsonify({"result": "success", "message": db_result})


## 피드 좋아요
@app.route("/api/feed/like", methods=["PUT"])
def feed_like_proc():
    # 요청 내용 파싱
    print(request.json)
    id = request.json["id"]
    db_result = db.feeds.find_one({"_id": ObjectId(id)})
    like = db_result["like"] + 1
    db.feeds.update_one({"_id": ObjectId(id)}, {"$set": {"like": like}})
    return jsonify({"result": "success", "message": "좋아요+1"})


if __name__ == "__main__":
    app.run("0.0.0.0", port=5000, debug=True)
