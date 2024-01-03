<template>
  <div class="app-container">
    <div>
      <!-- 可以搜索 -->
      迭代任务：
      <el-autocomplete
        v-model="selectedTaskName"
        :fetch-suggestions="querydeptTasks"
        placeholder="请输入内容"
        @select="handleSelect"
      />

      <!-- 不让输入 -->
      任务类型：
      <el-select v-model="taskType" placeholder="请选择" @change="handleTypeSelect">
        <el-option
          v-for="item in type"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <div>
      <el-table :data="tableData" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="nickname" label="牵头人" />
        <el-table-column prop="task.taskName" label="需求" />
        <!-- 直接用子属性名称就行 -->
        <el-table-column
          prop="task.stage"
          label="任务阶段"
          width="250"
        />
        <el-table-column label="迭代进度" width="350">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.progressReportList"
              :key="index"
            >
              {{ item.weekTime }}：{{ item.content }}
              <!-- 在这里展示子列表数据 -->
            </div>
          </template>
        </el-table-column>
        <!-- 0正常。1延期 -->
        <el-table-column prop="task.progress" label="进度" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { getDepartmentTask } from '@/api/task'
import progressApi from '@/api/progress'
import taskConfigApi from '@/api/taskConfig'

export default {
  data() {
    return {
      selectedTaskName: '', // 用于绑定搜索框的值
      departmentTasks: [], // 用于存储搜索结果
      departmentId: 10, // 用户所在部门id
      task: {
        // taskId: 3,
        // departmentId: 10,
        // taskName: "第四季度需求",
      },
      taskType: '',
      tableData: [],
      type: [
        {
          value: '功能研发',
          label: '功能研发'
        },
        {
          value: '应用优化',
          label: '应用优化'
        },
        {
          value: '测试/QA',
          label: '测试/QA'
        }
      ],
      // 展示的值 每一个kv另算
      value: ''
    }
  },
  created() {
    // this.fetchData();
  },
  methods: {
    fetchData() {
      const processTrans = {
        0: '正常',
        1: '延期',
        2: '不涉及'
      }
      progressApi.get(this.task).then((response) => {
        response.data.weeklyReports.forEach((item) => {
          item.task.progress = processTrans[item.task.progress]
        })
        this.tableData = response.data.weeklyReports
      })
    },
    // 查询部门父类任务，但是没赋值给task
    querydeptTasks(departmentId, cb) {
      getDepartmentTask(this.departmentId).then((response) => {
        this.departmentTasks = response.data
        const suggestions = response.data.map((item) => ({
          value: item.taskName,
          data: item // 将整个任务对象保存在data属性中
        }))
        cb(suggestions) // 将任务名称列表传递给 el-autocomplete 组件
      })
    },
    handleSelect(item) {
      // 用户在下拉框中选择了某个任务后，将对应的任务对象赋值给task
      this.task = item.data
      this.selectedTaskName = item.value // 将选择的任务名称赋值给selectedTaskName
      this.fetchData()
    },
    handleTypeSelect() {
      this.task.type = this.taskType
      this.fetchData()
    }
  }
}
</script>
