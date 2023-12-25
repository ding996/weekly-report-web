<template>
  <div class="app-container">
    <!-- 可以搜索 -->
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querydeptTasks"
      placeholder="请输入内容"
      @select="handleSelect"
    ></el-autocomplete>

    <!-- 不让输入 -->
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in type"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>

    <div>
      <el-table :data="tableData" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="username" label="牵头人"> </el-table-column>
        <el-table-column prop="taskName" label="需求"> </el-table-column>
        <el-table-column prop="stage" label="任务阶段"> </el-table-column>
        <el-table-column prop="content" label="迭代进度" width="350">
        </el-table-column>
        <el-table-column prop="progress" label="进度"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getDepartmentTask } from "@/api/task";
import progressApi from "@/api/progress";

export default {
  data() {
    return {
      state: "", // 用于绑定搜索框的值
      departmentTasks: [], // 用于存储搜索结果
      list: null,
      departmentId: 10, //需要调用方法获取
      task: {
        taskId: 3,
        departmentId: 10,
        type: "功能研发",
        taskName: "第四季度需求",
      },
      ProgressReportDTO: {},
      tableData: [
        {
          username: "12987122",
          taskName: "王小虎",
          stage: "234",
          content: "3.2",
          progress: 10,
        },
        {
          username: "12987123",
          taskName: "王小虎",
          stage: "165",
          content: "4.43",
          progress: 12,
        },
        {
          username: "12987124",
          taskName: "王小虎",
          stage: "324",
          content: "1.9",
          progress: 9,
        },
        {
          username: "12987125",
          taskName: "王小虎",
          stage: "621",
          content: "2.2",
          progress: 17,
        },
        {
          username: "12987126",
          taskName: "王小虎",
          stage: "539",
          content: "4.1",
          progress: 15,
        },
      ],
      type: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
      ],
      // 展示的值 每一个kv另算
      value: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      progressApi.get(this.task).then((response) => {
        // 拿到数据了
        this.ProgressReportDTO = response.data;
        // List<SingleProgressReport> weeklyReports;
        console.log(this.ProgressReportDTO.weeklyReports[0].progressReportList);
        this.tableData=this.ProgressReportDTO.weeklyReports[0];
      });
    },
    querydeptTasks(departmentId, cb) {
      getDepartmentTask(this.departmentId).then((response) => {
        const suggestions = response.data.map((item) => ({
          value: item.taskName,
        }));
        this.departmentTasks = suggestions.taskName; // 将查询结果赋值给 departmentTasks
        cb(suggestions); // 不懂为什么需要
      });
    },
    handleSelect(item) {
      // 处理选项被选择时的逻辑，可以在这里更新 state 值或触发其他操作
      this.state = item.value; // 将选择的值赋值给 state
      console.log(item);
    },
  },
};
</script>
