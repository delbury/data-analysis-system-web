import { ColumnProps } from '/@/components/CompTable/interface';
import { walkColumnConfig } from '/@/components/CompTable/util';

export const getColumns = (): ColumnProps[] => walkColumnConfig([
  {
    label: '日期',
    prop: 'date',
    customType: 'date',
  },
  {
    label: '培训开始时间',
    prop: 'start_time',
    customType: 'time',
  },
  {
    label: '培训结束时间',
    prop: 'end_time',
    customType: 'time',
  },
  {
    label: '开展单位',
    prop: 'company',
    showOverflowTooltip: true,
  },
  {
    label: '组织部门',
    prop: 'dept',
    showOverflowTooltip: true,
  },
  {
    label: '培训开展班组',
    prop: 'group_name',
    showOverflowTooltip: true,
  },
  {
    label: '项目编号',
    prop: 'project_code',
  },
  {
    label: '培训项目名称',
    prop: 'train_project_name',
    showOverflowTooltip: true,
  },
  {
    label: '培训课程名称',
    prop: 'train_course_name',
    showOverflowTooltip: true,
  },
  {
    label: '培训层级',
    prop: 'train_level',
  },
  {
    label: '培训内容',
    prop: 'train_content',
    showOverflowTooltip: true,
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
    showOverflowTooltip: true,
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
    prop: 'trainer_company',
    showOverflowTooltip: true,
  },
  {
    label: '培训人数',
    headerAlign: 'center',
    children: [
      {
        label: '培训人数',
        prop: 'trained_count_manage',
        customType: 'int',
        tip: '管理和业务技术',
      },
      {
        label: '培训人数',
        prop: 'trained_count_key',
        customType: 'int',
        tip: '行车关键岗位：司机、行车值班员',
      },
      {
        label: '培训人数',
        prop: 'trained_count_product',
        customType: 'int',
        tip: '生产人员：非行车关键岗位',
      },
      {
        label: '培训人数',
        prop: 'trained_count_new',
        customType: 'int',
        tip: '未持证人员：新员工、实习生等',
      },
      {
        label: '培训人数',
        prop: 'trained_count_work',
        customType: 'int',
        tip: '工勤',
      },
      {
        label: '培训总人数',
        prop: 'trained_count_total',
        customType: 'int',
      },
    ],
  },
  {
    label: '理论课时',
    prop: 'trained_hours_theory',
    customType: 'float',
  },
  {
    label: '实操课时',
    prop: 'trained_hours_practice',
    customType: 'float',
  },
  {
    label: '总课时',
    prop: 'trained_hours_total',
    customType: 'float',
  },
  {
    label: '培训效果评估人数',
    prop: 'train_effect_count',
    customType: 'int',
  },
  {
    label: '学员评价得分',
    prop: 'student_evaluation_score',
    customType: 'float',
  },
  {
    label: '项目负责人评价得分',
    prop: 'maintainer_evaluation_score',
    customType: 'float',
  },
  {
    label: '培训效果评价得分',
    prop: 'effect_evaluation_score',
    customType: 'float',
    tip: '等于学员评价得分*0.7+项目负责人评价得分*0.3',
  },
  {
    label: '培训课酬',
    prop: 'course_pay',
    customType: 'float',
  },
  {
    label: '创建时间',
    prop: 'created_time',
    customType: 'datetime',
  },
  {
    label: '备注',
    prop: 'remark',
    minWidth: 120,
    showOverflowTooltip: true,
  },
]);
