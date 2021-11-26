import { FormItemSection } from '/@/components/CompTable/interface';
import moment from 'moment';
import { apis } from '/@/service';
import { getRemoteSelectFormItemOptions } from '/@/components/CompTable/util';


const DEFAULT_DATE = '1970-01-01';

// 表单初始值
export const FORM_INIT_VALUES = {
  date: '',
  start_end_time: [],
  company: '运营一分公司',
  dept: '机电三车间',
  group_id: '',
  project_code: '',
  tran_project_name: '',
  train_course_name: '',
  train_level: '',
  train_content: '',
  train_way1: '',
  train_way2: '',
  train_type: '',
  train_class: '',
  maintainer_id: '',
  train_place: '',
  trainer_id: '',
  trained_count_manage: 0,
  trained_count_key: 0,
  trained_count_product: 0,
  trained_count_new: 0,
  trained_count_work: 0,
  trained_count_total: 0,
  trained_hours_theory: 0,
  trained_hours_practice: 0,
  trained_hours_total: 0,
  train_effect_count: 0,
  student_evaluation_score: 0,
  maintainer_evaluation_score: 0,
  effect_evaluation_score: 0,
  course_pay: 0,
  remark: '',
};

// 表单字段配置
export const FORM_ITEMS: FormItemSection[] = [
  {
    title: '培训计划',
    formItems: [
      {
        label: '日期',
        prop: 'date',
        customType: 'date',
        ruleNames: ['required'],
        valueSubmitHandler: ({ value }) => {
          return {
            date: moment(value).format('YYYY-MM-DD HH:mm:ss'),
          };
        },
      },
      {
        label: '培训时间',
        prop: 'start_end_time',
        customType: 'timerange',
        ruleNames: ['required'],
        valueSubmitHandler: ({ value }) => {
          return {
            start_time: moment(value[0]).format('HH:mm:ss'),
            end_time: moment(value[1]).format('HH:mm:ss'),
          };
        },
        valueRebuildHandler: ({ params }) => {
          return {
            start_end_time: [
              `${params.date ?? DEFAULT_DATE} ${params.start_time}`,
              `${params.date ?? DEFAULT_DATE} ${params.end_time}`,
            ],
          };
        },
      },
      {
        label: '开展单位',
        prop: 'company',
        disabled: true,
        ruleNames: ['required'],
      },
      {
        label: '组织部门',
        prop: 'dept',
        disabled: true,
        ruleNames: ['required'],
      },
      {
        label: '培训开展班组',
        prop: 'group_id',
        customType: 'remote-select',
        customOption: {
          ...getRemoteSelectFormItemOptions(apis.basedata_teamgroup.get, {
            rebuildLabelField: 'group_name',
            rebuildValueField: 'group_id',
          }),
        },
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
        prop: 'trainer_company',
      },
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
    ],
  },
  {
    title: '培训完成情况',
    formItems: [
      {
        label: '培训效果评估人数',
        prop: 'train_effect_count',
        customType: 'int',
        ruleNames: ['intUnsigned'],
      },
      {
        label: '学员评价得分',
        prop: 'student_evaluation_score',
        customType: 'float',
        ruleNames: ['floatUnsigned'],
      },
      {
        label: '项目负责人评价得分',
        prop: 'maintainer_evaluation_score',
        customType: 'float',
        ruleNames: ['floatUnsigned'],
      },
      {
        label: '培训效果评价得分',
        prop: 'effect_evaluation_score',
        tip: '等于学员评价得分*0.7+项目负责人评价得分*0.3',
        customType: 'float',
        ruleNames: ['floatUnsigned'],
      },
      {
        label: '培训课酬',
        prop: 'course_pay',
        customType: 'float',
        ruleNames: ['floatUnsigned'],
      },

    ],
  },
  {
    title: '其他',
    formItems: [
      {
        label: '备注',
        prop: 'remark',
        span: 24,
        customType: 'textarea',
      },
    ],
  },
];
