<template>
  <div class="app-container">
    <div>
      <h3>
        条线：{{ parentDept.departmentName }} 条线负责人：{{
          parentDept.leaderUsername
        }}
      </h3>
      <el-select
        v-model="value"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="请选择组别"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="block">
        <span class="demonstration">周</span>
        <el-date-picker
          v-model="value1"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周"
        >
        </el-date-picker>
      </div>
    </div>

    <div>
      <el-table
        :data="processedData"
        style="width: 100%"
        :span-method="objectSpanMethod"
      >
        <el-table-column prop="departmentName" label="组别" />
        <el-table-column prop="departmentLeaderName" label="组别负责人" />
        <el-table-column prop="deptThisWeekReport" label="本周工作内容" />
        <el-table-column prop="deptNextWeekReport" label="本周工作内容" />
        <el-table-column prop="moduleName" label="模块" />
        <el-table-column
          prop="moduleLeaderName"
          label="模块牵头人"
        ></el-table-column>
        <el-table-column prop="moduleThisWeekReport" label="本周工作内容" />
        <el-table-column prop="moduleNextWeekReport" label="下周工作安排" />
        <el-table-column prop="username" label="成员"></el-table-column>
        <el-table-column
          prop="userThisWeekReport"
          label="本周工作内容"
        ></el-table-column>
        <el-table-column
          prop="userNextWeekReport"
          label="下周工作安排"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import departmentApi from "@/api/department";
import weeklyReportApi from "@/api/weeklyReport";

export default {
  data() {
    return {
      options: [
        {
          value: "全部",
          label: "全部",
        },
        {
          value: "开发一组",
          label: "开发一组",
        },
        {
          value: "开发二组",
          label: "开发二组",
        },
      ],
      value: [],
      value1: "",
      parentDept: {},
      weeklyReport: {},
      moduleWeeklyReportList: [],
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    processedData() {
      let result = [];
      this.moduleWeeklyReportList.forEach((module) => {
        module.usersWeeklyReports.forEach((user) => {
          result.push({
            departmentName: this.weeklyReport.departmentName,
            departmentLeaderName: this.weeklyReport.departmentLeaderName,
            deptThisWeekReport: this.weeklyReport.thisWeekReport,
            deptNextWeekReport: this.weeklyReport.nextWeekReport,
            moduleName: module.moduleName,
            moduleLeaderName: module.moduleLeaderName,
            moduleThisWeekReport: module.weeklyReport.thisWeekReport,
            moduleNextWeekReport: module.weeklyReport.nextWeekReport,
            username: user.username,
            userThisWeekReport: user.thisWeekReport,
            userNextWeekReport: user.nextWeekReport,
          });
        });
      });

      return result;
    },
  },
  methods: {
    fetchData() {
      departmentApi.getParentDept(10).then((response) => {
        this.parentDept = response.data;
      });
      weeklyReportApi.getDepartmentReport(10, 20231222).then((response) => {
        this.moduleWeeklyReportList = response.data.moduleWeeklyReportList;
        this.weeklyReport = response.data.weeklyReport;
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 合并模块名称和模块牵头人列
      if (columnIndex >= 0 && columnIndex <= 3) {
        if (rowIndex > 0) {
          // 获取上一行数据
          const prevRow = this.processedData[rowIndex - 1];
          // 检查模块名称和牵头人是否相同
          if (
            prevRow.departmentName === row.departmentName &&
            prevRow.departmentLeaderName === row.departmentLeaderName &&
            prevRow.deptThisWeekReport === row.deptThisWeekReport &&
            prevRow.deptNextWeekReport === row.deptNextWeekReport
          ) {
            // 如果相同，则隐藏当前单元格
            return { rowspan: 0, colspan: 1 };
          }
        }

        let rowspan = 1;
        let currentRowIndex = rowIndex;
        // 查找连续相同模块名称和牵头人的行数
        while (
          currentRowIndex + 1 < this.processedData.length &&
          this.processedData[currentRowIndex + 1].departmentName ===
            row.departmentName &&
          this.processedData[currentRowIndex + 1].departmentLeaderName ===
            row.departmentLeaderName &&
          this.processedData[currentRowIndex + 1].departmentLeaderName ===
            row.departmentLeaderName &&
          this.processedData[currentRowIndex + 1].deptNextWeekReport ===
            row.deptNextWeekReport
        ) {
          rowspan++;
          currentRowIndex++;
        }

        // 如果当前行是连续相同模块的最后一行，设置rowspan
        if (rowIndex + rowspan === currentRowIndex + 1) {
          return { rowspan, colspan: 1 };
        }
      }
      if (columnIndex >= 4 && columnIndex <= 7) {
        if (rowIndex > 0) {
          // 获取上一行数据
          const prevRow = this.processedData[rowIndex - 1];
          // 检查模块名称和牵头人是否相同
          if (
            prevRow.moduleName === row.moduleName &&
            prevRow.moduleLeaderName === row.moduleLeaderName &&
            prevRow.moduleThisWeekReport === row.moduleThisWeekReport &&
            prevRow.moduleNextWeekReport === row.moduleNextWeekReport
          ) {
            // 如果相同，则隐藏当前单元格
            return { rowspan: 0, colspan: 1 };
          }
        }

        let rowspan = 1;
        let currentRowIndex = rowIndex;
        // 查找连续相同模块名称和牵头人的行数
        while (
          currentRowIndex + 1 < this.processedData.length &&
          this.processedData[currentRowIndex + 1].moduleName ===
            row.moduleName &&
          this.processedData[currentRowIndex + 1].moduleLeaderName ===
            row.moduleLeaderName &&
          this.processedData[currentRowIndex + 1].moduleLeaderName ===
            row.moduleLeaderName &&
          this.processedData[currentRowIndex + 1].moduleNextWeekReport ===
            row.moduleNextWeekReport
        ) {
          rowspan++;
          currentRowIndex++;
        }

        // 如果当前行是连续相同模块的最后一行，设置rowspan
        if (rowIndex + rowspan === currentRowIndex + 1) {
          return { rowspan, colspan: 1 };
        }
      }

      // 默认不合并
      return { rowspan: 1, colspan: 1 };
    },
  },
};
</script>
