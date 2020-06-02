<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 图标区域 -->
      <div class="image_box">
        <img src="../assets/logo3.png" alt />
      </div>
      <!-- 登陆表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop='password'>
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//解决跨域post请求后端接受不到数据 npm install qs --save-dev
import qs from 'qs'

export default {
  data() {
    return {
      // 登陆表单数据
      loginForm: {
        username: "zhangsan",
        password: "123456"
      },
      loginFormRules: {
        username:[
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
        password:[
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    resetLoginForm(){
      const {data:res}=  this.$refs.loginFormRef.resetFields();
      console.log(res);
    },
    login(){
      this.$refs.loginFormRef.validate(async validate =>{
        if(!validate) return;
        const {data:res} = await this.$http.post('login',qs.stringify(this.loginForm));
        if(res.code!=200) return this.$message.error("登陆失败！");
        this.$message.success("登陆成功！");
        //将登录token存放到session对象
        window.sessionStorage.setItem("token",res.message);
        //跳转
        this.$router.push("/home");
      })
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .image_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    margin-top: 15px;
    img {
      height: 90%;
      width: 90%;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>