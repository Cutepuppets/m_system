<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索栏和按钮添加 -->
      <el-row :gutter="20">
        <!-- 搜索 -->
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfor.key" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getuserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="isAddDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号码" prop="phoneNum" width="120px"></el-table-column>
        <el-table-column label="性别" prop="sex" width="50px"></el-table-column>
        <el-table-column label="生日" prop="birthday" width="180px"></el-table-column>
        <el-table-column label="创建日期" prop="createDate" width="180px"></el-table-column>
        <el-table-column label="最后访问IP" prop="lastAccessIp" width="130px"></el-table-column>
        <el-table-column label="vip" width="90px">
          <template slot-scope="scope">
            <span v-if="scope.row.vip==0">VIP</span>
            <span v-if="scope.row.vip==1">SVIP1</span>
            <span v-if="scope.row.vip==7">SVIP7</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="75px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="userStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="允许发言" width="95px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.allowSpeaking"
              @change="userAllowSpeakingStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="设置" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteUserByid(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfor.page"
        :page-sizes="[2, 5, 10, 30]"
        :page-size="queryInfor.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="isAddDialogVisible" width="50%" @close="addDialogClose">
      <!-- 内容主体区域 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phoneNum">
          <el-input v-model="addForm.phoneNum"></el-input>
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-switch v-model="addForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="isEditDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="editForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-input v-model="editForm.birthday"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNum">
          <el-input v-model="editForm.phoneNum"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    //定义校验规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      if (regEmail.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的邮箱"));
    };
    var checkPhoneNum = (rule, value, cb) => {
      const regCellphone = /^1[34578]\d{9}$/;
      if (regCellphone.test(value)) {
        return cb();
      }
      return cb(new Error("请输入合法的手机号"));
    };
    return {
      //用户列表参数
      queryInfor: {
        //搜索
        key: "",
        //当前页数
        page: 1,
        //当前页显示的条目数
        rows: 10
      },
      userList: [],
      total: 0,
      // 控制对话框显示隐藏
      isAddDialogVisible: false,
      //修改对话框显示隐藏
      isEditDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        phoneNum: "",
        status: false
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        phoneNum: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhoneNum, trigger: "blur" }
        ]
      },
      editForm: {},
      editFormRules: {
         username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
         password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        phoneNum: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhoneNum, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getuserList();
  },
  methods: {
    async getuserList() {
      const { data: res } = await this.$http.get("user/getUserList", {
        params: this.queryInfor
      });
      if (res.code !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.items;
      this.total = res.data.total;
      console.log(res);
    },
    // 监听每页显示条数rows事件
    handleSizeChange(newRows) {
      this.queryInfor.rows = newRows;
      this.getuserList();
    },
    // 监听当前页码改变事件
    handleCurrentChange(newPage) {
      this.queryInfor.page = newPage;
      this.getuserList();
    },
    // 监听用户状态Switch开关
    async userStatusChange(userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$http.put(
        `user/${userInfo.id}/status/${userInfo.status}`
      );
      if (res.code !== 200) {
        //更新失败后立即重置页面status状态
        userInfo.status = !userInfo.status;
        return this.$$message.success("用户状态更新失败");
      }
      return this.$$message.success("用户状态更新成功");
    },
    // 监听禁言状态switch开关
    async userAllowSpeakingStatusChange(userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$http.put(
        `user/${userInfo.id}/allowSpeaking/${userInfo.allowSpeaking}`
      );
      if (res.code !== 200) {
        //更新失败后立即重置页面status状态
        userInfo.allowSpeaking = !userInfo.allowSpeaking;
        return this.$$message.success("用户状态更新失败");
      }
      return this.$$message.success("用户状态更新成功");
    },
    // 添加用户对话框关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    //对话框添加新用户按钮
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "user",
          qs.stringify(this.addForm)
        );
        if (res.code !== 200) {
          return this.$message.error("用户添加失败");
        }
        this.isAddDialogVisible = false;
        return this.$message.success("用户添加成功");
        this.getuserList();
      });
    },
    //修改用户信息
    async showEditDialog(id) {
      this.isEditDialogVisible = true;
      const { data: res } = await this.$http.get("user/" + id);
      if (res.code !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editForm = res.data;
      this.isEditDialogVisible = true;
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        console.log(this.editForm);
        const { data: res } = await this.$http.put(
          "user",
          qs.stringify(this.editForm)
        )
        if (res.code !== 200) {
          return this.$message.error("用户修改失败");
        }
        this.isEditDialogVisible = false;
        this.getuserList();
        return this.$message.success("用户修改成功");
      });
    },
    async deleteUserByid(id){
        const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?',
          '提示', 
          {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }
        ).catch(error => error)
        console.log(confirmResult)
        if(confirmResult!=='confirm'){
          return this.$message.info("已经取消删除")
        }
        this.$http.delete('user/'+id)
        this.getuserList()
         return this.$message.success("已经删除该用户")
    }
  }
};
</script>

<style lang="less" scoped>
</style>