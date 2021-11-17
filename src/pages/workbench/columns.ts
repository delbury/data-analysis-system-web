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
    prop: 'start_time',
  },
  {
    label: '培训结束时间',
    prop: 'end_time',
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
    prop: 'project_code',
  },
  {
    label: '培训项目名称',
    prop: 'train_project_name',
  },
  {
    label: '培训课程名称',
    prop: 'train_course_name',
  },
  {
    label: '培训层级',
    prop: 'train_level',
  },
  {
    label: '培训内容',
    prop: 'train_content',
  },
  {
    label: '培训方式1',
    prop: 'train_way1',
  },
  {
    label: '培训方式2',
    prop: 'train_way2',
  },
  {
    label: '培训形式',
    prop: 'train_type',
  },
  {
    label: '培训线别',
    prop: 'train_class',
  },
  {
    label: '培训项目负责人',
    prop: 'maintainer_name',
  },
  {
    label: '培训负责人工号',
    prop: 'maintainer_code',
  },
  {
    label: '培训地点',
    prop: 'train_place',
  },
  {
    label: '培训师',
    prop: 'trainer_id',
  },
  {
    label: '培训师工号/外部师资编号',
    prop: 'trainer_code',
  },
  {
    label: '培训师星级',
    prop: 'trainer_level',
  },
  {
    label: '培训师所属单位',
    prop: 'trainer_unit',
  },
  {
    label: '培训人数（管理和业务技术）',
    prop: 'trained_count_manage',
  },
  {
    label: '培训人数（行车关键岗位：司机、行车值班员）',
    prop: 'trained_count_key',
  },
  {
    label: '培训人数（生产人员：非行车关键岗位）',
    prop: 'trained_count_product',
  },
  {
    label: '培训人数（未持证人员：新员工、实习生等）',
    prop: 'trained_count_new',
  },
  {
    label: '培训人数（工勤）',
    prop: 'trained_count_work',
  },
  {
    label: '培训总人数',
    prop: 'trained_count_total',
  },
  {
    label: '理论课时',
    prop: 'train_hours_theory',
  },
  {
    label: '实操课时',
    prop: 'train_hours_practice',
  },
  {
    label: '总课时',
    prop: 'train_hours_total',
  },
  {
    label: '培训效果评估人数',
    prop: 'train_effect_count',
  },
  {
    label: '学员评价得分',
    prop: 'student_evaluation_score',
  },
  {
    label: '项目负责人评价得分',
    prop: 'maintainer_evaluation_score',
  },
  {
    label: '培训效果评价得分（等于学员评价得分*0.7+项目负责人评价得分*0.3）',
    prop: 'effect_evaluation_score',
  },
  {
    label: '培训课酬',
    prop: 'course_pay',
  },
  {
    label: '备注',
    prop: 'remark',
  },
  {
    label: '创建时间',
    prop: 'created_time',
  },
];
