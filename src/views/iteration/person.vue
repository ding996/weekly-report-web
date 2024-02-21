<template>
  <div class="app-container">
    <div>
      <span class="demonstration">年份</span>
      <el-date-picker v-model="yearTime" type="year" placeholder="选择年">
      </el-date-picker>
      <!-- 可以搜索 -->
      季度：
      <el-autocomplete
        v-model="selectedTask.name"
        :fetch-suggestions="querydeptTasks"
        placeholder="请输入内容"
        @select="handleSelect"
      />
      任务类型：
      <el-select
        v-model="taskType"
        placeholder="请选择"
        @change="handleTypeSelect"
      >
        <el-option
          v-for="item in types"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      任务项：
      <el-select
        v-model="currentTask"
        placeholder="请选择"
        @visible-change="handlePersonSelect"
      >
        <el-option
          v-for="item in personTaskLsits"
          :key="item.value"
          :label="item.taskName"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>

    <div>
      <el-table :data="tableData" border style="width: 100%; margin-top: 20px">
        <el-table-column prop=".weekTime" label="时间" />
        <!-- 直接用子属性名称就行 -->
        <el-table-column prop="content" label="进度内容" />
        <el-table-column prop="" label="操作"
          ><el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="primary" icon="el-icon-delete"
            >删除</el-button
          ></el-table-column
        >
      </el-table>
    </div>
  </div>
</template>

<script>
import taskApi from "@/api/task";
import progressApi from "@/api/progress";
import taskConfigApi from "@/api/taskConfig";
import { getInfo } from "@/api/user";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      yearTime: new Date(),
      selectedTask: {}, // 用于绑定搜索框的值
      departmentTasks: [], // 用于存储搜索结果
      personTaskLsits: [],
      departmentId: null, // 用户所在部门id
      task: {},
      taskType: "",
      tableData: [],
      types: [],
      // 展示的值 每一个kv另算
      value: "",
      currentTask: {},
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    fetchData() {
      this.queryPersonProgressRept();
    },
    queryPersonProgressRept() {
      if (this.currentTask.taskId != null) {
        progressApi
          .personGet(1, this.currentTask.taskId, this.taskType)
          .then((response) => {
            this.tableData = response.data;
          });
      }else {
        this.tableData = null;
      }
    },
    // 查询部门父类任务，但是没赋值给task
    querydeptTasks(queryString, cb) {
      taskApi
        .getDepartmentTask(
          this.departmentId,
          new Date(this.yearTime).getFullYear()
        )
        .then((response) => {
          this.departmentTasks = response.data;
          const suggestions = response.data.map((item) => ({
            value: item.taskName,
            data: item, // 将整个任务对象保存在data属性中
          }));
          cb(suggestions); // 将任务名称列表传递给 el-autocomplete 组件
        });
    },
    getUserInfo() {
      getInfo(getToken()).then((response) => {
        this.departmentId = response.data.team.departmentId;
        this.getTaskConfig();
      });
    },
    getTaskConfig() {
      taskConfigApi.departmentTaskGet(this.departmentId).then((response) => {
        this.types = response.data.map((item) => item.typeName);
      });
    },
    handleSelect(item) {
      this.task = item.data;
      this.selectedTask.name = this.task.taskName;
      this.selectedTask.taskId = this.task.taskId;
    },
    handlePersonSelect() {
      if (this.selectedTask.taskId != null) {
        taskApi
          .personTaskList(1, this.selectedTask.taskId, this.taskType)
          .then((response) => {
            this.personTaskLsits = response.data;
            this.fetchData();
          });
      }
      
    },
    handleTypeSelect() {
      this.task.type = this.taskType;
      this.currentTask = {};
      this.fetchData();
    },
  },
};
</script>
