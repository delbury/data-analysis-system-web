import { FormItemSection } from '~/components/CompTable/interface';
import moment from 'moment';
import { getFormItemInitValues } from '~/components/CompTable/util';
import common from '~/pages/common';

const DEFAULT_DATE = '1970-01-01';


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
        default: '运营一分公司',
      },
      {
        label: '组织部门',
        prop: 'dept',
        disabled: true,
        ruleNames: ['required'],
        default: '机电三车间',
      },
      {
        label: '培训开展班组',
        prop: 'group_id',
        ruleNames: ['required'],
        customType: 'remote-select',
        customOption: {
          ...common.remote.GROUP_ID_REMOTE_OPTIONS,
        },
      },
      {
        label: '项目编号',
        prop: 'project_code',
        ruleNames: ['required'],
      },
      {
        label: '培训项目名称',
        prop: 'train_project_name',
        ruleNames: ['required'],
      },
      {
        label: '培训课程名称',
        prop: 'train_course_name',
        ruleNames: ['required'],
      },
      {
        label: '培训层级',
        prop: 'train_level',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_LEVEL_OPTIONS,
        },
      },
      {
        label: '培训内容',
        prop: 'train_content',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_CONTENT_OPTIONS,
        },
      },
      {
        label: '培训方式1',
        prop: 'train_way1',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_WAY1_OPTIONS,
        },
      },
      {
        label: '培训方式2',
        prop: 'train_way2',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_WAY2_OPTIONS,
        },
      },
      {
        label: '培训形式',
        prop: 'train_type',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_TYPE_OPTION,
        },
      },
      {
        label: '培训线别',
        prop: 'train_class',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_CLASS_OPTIONS,

        },
      },
      {
        label: '培训项目负责人',
        prop: 'maintainer',
        ruleNames: ['required'],
      },
      {
        label: '培训负责人工号',
        prop: 'maintainer_code',
        ruleNames: ['required'],
      },
      {
        label: '培训地点',
        prop: 'train_place',
        ruleNames: ['required'],
      },
      {
        label: '培训师',
        prop: 'trainer',
        ruleNames: ['required'],
      },
      {
        label: '培训师工号/外部师资编号',
        prop: 'trainer_code',
        ruleNames: ['required'],
      },
      {
        label: '培训师星级',
        prop: 'trainer_level',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAINER_LEVEL_OPTIONS,
        },
      },
      {
        label: '培训师所属单位',
        prop: 'trainer_company',
        default: '机电三车间',
        disabled: true,
        ruleNames: ['required'],
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
        info: '等于管理和业务技术、行车关键岗位、生产人员、未持证人员、工勤等培训人数之和',
        customType: 'int',
        customOption: {
          controls: false,
        },
        disabled: true,
        formValueChangeHandler: (current, old, form) => {
          if(form) {
            form.trained_count_total = current.trained_count_manage +
              current.trained_count_key + current.trained_count_product +
              current.trained_count_new + current.trained_count_work;
          }
        },
        ruleNames: ['required', 'notZero'],
      },
      {
        label: '理论课时',
        prop: 'trained_hours_theory',
        tip: '小时',
        customType: 'float',
        customOption: {
          precision: 1,
        },
      },
      {
        label: '实操课时',
        prop: 'trained_hours_practice',
        tip: '小时',
        customType: 'float',
        customOption: {
          precision: 1,
        },
      },
      {
        label: '总课时',
        prop: 'trained_hours_total',
        tip: '小时',
        info: '等于理论课时与实操课时之和',
        customType: 'float',
        disabled: true,
        customOption: {
          precision: 1,
        },
        formValueChangeHandler: (current, old, form) => {
          if(form) {
            form.trained_hours_total = current.trained_hours_practice + current.trained_hours_theory;
          }
        },
        ruleNames: ['required', 'notZero'],
      },
    ],
  },
  {
    title: '培训完成情况',
    sectionDisabled: (detail) => {
      return detail?.status === void 0;
    },
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
        customOption: {
          controls: false,
        },
        disabled: true,
        formValueChangeHandler: (current, old, form) => {
          if(form) {
            form.effect_evaluation_score = current.student_evaluation_score * 0.7 +
              current.maintainer_evaluation_score * 0.3;
          }
        },
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

// 表单初始值
export const FORM_INIT_VALUES = getFormItemInitValues(FORM_ITEMS);
