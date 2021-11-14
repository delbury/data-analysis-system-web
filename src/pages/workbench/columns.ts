import { ElTableColumn } from 'element-plus/es/components/table';

type ColumnProps = InstanceType<typeof ElTableColumn>['$props'];

export const getColumns = (): ColumnProps[] => [
  {
    label: '序号',
    type: 'index',
  },
  {
    label: '日期',
    prop: 'date',
  },
  {
    label: '培训开始时间',
    prop: 'startTime',
  },
  {
    label: '培训结束时间',
    prop: 'endTime',
  },
  {
    label: '开展单位',
    prop: 'unit',
  },
  {
    label: '组织部门',
    prop: 'dept',
  },
  {
    label: '项目编号',
    prop: 'projectCode',
  },
  {
    label: '培训项目名称',
    prop: 'trainProjectName',
  },
  {
    label: '培训课程名称',
    prop: 'trainCourseName',
  },
  {
    label: '培训层级',
    prop: 'trainLevel',
  },
  {
    label: '培训内容',
    prop: 'trainContent',
  },
  {
    label: '培训方式1',
    prop: 'trainWay1',
  },
  {
    label: '培训方式2',
    prop: 'trainWay2',
  },
  {
    label: '培训形式',
    prop: 'trainType',
  },
  {
    label: '培训线别',
    prop: 'trainClass',
  },
  {
    label: '培训项目负责人',
    prop: 'maintainerName',
  },
  {
    label: '培训负责人工号',
    prop: 'maintainerCode',
  },
  {
    label: '培训地点',
    prop: 'trainPlace',
  },
  {
    label: '培训师',
    prop: 'trainer',
  },
  {
    label: '培训师工号/外部师资编号',
    prop: 'trainerCode',
  },
  {
    label: '培训师星级',
    prop: 'trainerLevel',
  },
  {
    label: '培训师所属单位',
    prop: 'trainerUnit',
  },
  {
    label: '培训人数（管理和业务技术）',
    prop: 'trainedCountManage',
  },
  {
    label: '培训人数（行车关键岗位：司机、行车值班员）',
    prop: 'trainedCountKey',
  },
  {
    label: '培训人数（生产人员：非行车关键岗位）',
    prop: 'trainedCountProduct',
  },
  {
    label: '培训人数（未持证人员：新员工、实习生等）',
    prop: 'trainedCountNew',
  },
  {
    label: '培训人数（工勤）',
    prop: 'trainedCountWork',
  },
  {
    label: '培训总人数',
    prop: 'trainedCountTotal',
  },
  {
    label: '理论课时',
    prop: 'trainHoursTheory',
  },
  {
    label: '实操课时',
    prop: 'trainHoursPractice',
  },
  {
    label: '总课时',
    prop: 'trainHoursTotal',
  },
  {
    label: '培训效果评估人数',
    prop: 'trainEffectCount',
  },
  {
    label: '学员评价得分',
    prop: 'studentEvaluationScore',
  },
  {
    label: '项目负责人评价得分',
    prop: 'maintainerEvaluationScore',
  },
  {
    label: '培训效果评价得分（等于学员评价得分*0.7+项目负责人评价得分*0.3）',
    prop: 'effectEvaluationScore',
  },
  {
    label: '培训课酬',
    prop: 'coursePay',
  },
  {
    label: '备注',
    prop: 'remark',
  },
];
