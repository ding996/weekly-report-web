<template>
  <div class="app-container">
    <span class="demonstration">年份</span>
    <el-date-picker v-model="yearTime" type="year" placeholder="选择年">
    </el-date-picker>
    季度：
    <el-autocomplete
      v-model="selectedTask.name"
      :fetch-suggestions="querydeptTasks"
      placeholder="请输入内容"
      @select="handleSelect"
    />
    <hr />
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="任务名称">
        <el-select
          v-model="form.taskName"
          placeholder="请选择"
          @focus="handlePersonSelect"
        >
          <el-option
            v-for="item in personTaskLsits"
            :key="item.value"
            :label="item.taskName"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 接口获取 -->
      <el-form-item label="任务类型">
        <el-select v-model="form.type" placeholder="请选择任务类型">
          <el-option label="功能研发" value="shanghai" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务阶段">
        <el-select
          v-model="form.progressReportVO.stage"
          placeholder="请选择任务阶段"
        >
          <el-option label="需求评估" value="需求评估" />
          <el-option label="方案设计" value="方案设计" />
          <el-option label="开发自测" value="开发自测" />
          <el-option label="UAT测试" value="UAT测试" />
          <el-option label="投产实施" value="投产实施" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务进度">
        <el-radio-group v-model="form.progress">
          <el-radio label="正常" />
          <el-radio label="延期" />
          <el-radio label="关闭" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="迭代时间">
        <el-input
          v-model="form.progressReportVO.progressReport.weekTime"
          placeholder="格式为X年X月X日, 例如2024年2月7日"
        />
      </el-form-item>
      <el-form-item label="迭代内容">
        <el-input
          v-model="form.progressReportVO.progressReport.content"
          type="textarea"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import progressApi from "@/api/progress";
import taskApi from "@/api/task";
import taskConfigApi from "@/api/taskConfig";

export default {
  data() {
    return {
      selectedTask: {}, // 用于绑定搜索框的值
      departmentId: 10, // 用户所在部门id
      yearTime: new Date(), 
      personTaskLsits: [],
      form: {
        progressReportVO: {
          progressReport: {
            uid: 1,
            departmentId: 10,
            taskId: 1,
            content: "",
            weekTime: "2024年2月7日",
          },
          stage: "开发自测",
        },
        type: "功能研发",
        progress: "正常",
        taskName: "",
      },
    };
  },
  methods: {
    fetch() {},
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
    handleSelect(item) {
      this.task = item.data;
      this.selectedTask.name = this.task.taskName;
      this.selectedTask.taskId = this.task.taskId;
    },
    onSubmit() {
      progressApi.saveOrUpdate(this.form.progressReportVO).then((response) => {
        this.$message(response.message);
      });
    },
    onSave() {
      this.$message({
        message: "保存成功!",
        type: "warning",
      });
    },
    handlePersonSelect() {
      taskApi.personTaskList(1, this.selectedTask.taskId).then((response) => {
        this.personTaskLsits = response.data;
      });
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
