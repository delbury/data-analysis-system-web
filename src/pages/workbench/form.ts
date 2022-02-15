import { FormItemSection } from '~/components/CompTable/interface';
import moment from 'moment';
import { getFormItemInitValues } from '~/components/CompTable/util';
import common from '~/pages/common';
import { WorkbenchTable as RawWorkbenchTable } from '~types/db-table-type/Workbench';
import { apis } from '~/service';

interface WorkbenchTable extends RawWorkbenchTable {
  start_end_time?: [Date, Date];
}

const DEFAULT_DATE = '1970-01-01';

// 星级对应薪酬
const TRAINER_LEVEL_SALARY_MAP: Record<number, number> = {
  0: 0,
  1: 0,
  2: 50,
  3: 100,
  4: 150,
};
// 总培训课时
const totalHourHandler = (current: number, form: WorkbenchTable) => {
  if(!form.start_end_time) {
    form.trained_hours_practice = 0;
    form.trained_hours_theory = 0;
  }
  let duration: number = (form.start_end_time?.[1]?.valueOf() ?? 0) - (form.start_end_time?.[0]?.valueOf() ?? 0);
  duration = +(duration / 1000 / 3600).toFixed(2);

  if(form.train_way1 === '理论') {
    form.trained_hours_practice = 0;
    form.trained_hours_theory = duration;
  } else if(form.train_way1 === '实操') {
    form.trained_hours_theory = 0;
    form.trained_hours_practice = duration;
  }
  form.trained_hours_total = duration;
  form.course_pay = duration * (TRAINER_LEVEL_SALARY_MAP[form.trainer_level] ?? 0);
};
// 总培训人数
const totalTrainedHandler = (current: number, form: WorkbenchTable) => {
  form.trained_count_total = form.trained_count_manage +
      form.trained_count_key + form.trained_count_product +
      form.trained_count_new + form.trained_count_work;
};
// 课酬
const salaryHandler = (current: number, form: WorkbenchTable) => {
  form.course_pay = (TRAINER_LEVEL_SALARY_MAP[form.trainer_level] ?? 0) * (form.trained_hours_total ?? 0);
};
// 培训效果评价得分
const trainEffectScore = (current, form: WorkbenchTable) => {
  form.effect_evaluation_score = +((form.student_evaluation_score * 0.7 +
      form.maintainer_evaluation_score * 0.3) as number).toFixed(2);
};

// 表单字段配置
export const FORM_ITEMS: FormItemSection[] = [
  {
    title: '时间信息',
    formItems: [
      {
        label: '日期',
        prop: 'date',
        customType: 'date',
        ruleNames: ['required'],
        valueSubmitHandler: ({ value }) => {
          return {
            date: moment(value).format('YYYY-MM-DD'),
          };
        },
        importDefaultCol: 'B',
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
              new Date(`${params.date ?? DEFAULT_DATE} ${params.start_time}`),
              new Date(`${params.date ?? DEFAULT_DATE} ${params.end_time}`),
            ],
          };
        },
        formValueChangeHandler: totalHourHandler,
        importDefaultCol: { start_time: { col: 'C', label: '开始时间' }, end_time: { col: 'D', label: '结束时间' }},
        importMergeCols: ['start_time', 'end_time'],
      },
      {
        label: '培训方式1',
        prop: 'train_way1',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_WAY1_OPTIONS,
        },
        formValueChangeHandler: totalHourHandler,
        importDefaultCol: 'L',
      },
      {
        label: '理论课时',
        prop: 'trained_hours_theory',
        tip: '小时',
        customType: 'float',
        customOption: {
          precision: 1,
        },
        // disabled: (form: WorkbenchTable) => form.train_way1 !== '理论',
        disabled: true,
        // formValueChangeHandler: totalHourHandler,
        importDefaultCol: 'AC',
      },
      {
        label: '实操课时',
        prop: 'trained_hours_practice',
        tip: '小时',
        customType: 'float',
        customOption: {
          precision: 1,
        },
        // disabled: (form: WorkbenchTable) => form.train_way1 !== '实操',
        disabled: true,
        // formValueChangeHandler: totalHourHandler,
        importDefaultCol: 'AD',
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
        ruleNames: ['required', 'notZero'],
        formValueChangeHandler: salaryHandler,
        importDefaultCol: 'AE',
      },
    ],
  },
  {
    title: '培训主体',
    formItems: [
      {
        label: '开展单位',
        prop: 'company',
        disabled: true,
        ruleNames: ['required'],
        default: '运营一分公司',
        importDefaultCol: 'E',
      },
      {
        label: '组织部门',
        prop: 'dept',
        disabled: true,
        ruleNames: ['required'],
        default: '机电三车间',
        importDefaultCol: 'F',
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
        label: '培训项目名称',
        prop: 'train_project_name',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_PROJECT_NAME,
        },
        formValueChangeHandler: async (val, form: WorkbenchTable, opt?: { other: { code: number } }) => {
          if(val) {
            const res = apis.workbench.getProjectCode({ project: val, code: opt?.other?.code ?? 0 });
            form.project_code = (await res).data.data ?? '';
          } else {
            form.project_code = '';
          }
        },
        importDefaultCol: 'H',
      },
      {
        label: '项目编号',
        prop: 'project_code',
        ruleNames: ['required'],
        customOption: {
          placeholder: '选择培训项目名称自动生成',
        },
        importDefaultCol: 'G',
      },
      {
        label: '培训课程名称',
        prop: 'train_course_name',
        ruleNames: ['required'],
        importDefaultCol: 'I',
      },
      {
        label: '培训层级',
        prop: 'train_level',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_LEVEL_OPTIONS,
        },
        importDefaultCol: 'J',
      },
      {
        label: '培训内容',
        prop: 'train_content',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_CONTENT_OPTIONS,
        },
        importDefaultCol: 'K',
      },
      {
        label: '培训方式2',
        prop: 'train_way2',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_WAY2_OPTIONS,
        },
        importDefaultCol: 'M',
      },
      {
        label: '培训形式',
        prop: 'train_type',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_TYPE_OPTION,
        },
        importDefaultCol: 'N',
      },
      {
        label: '培训线别',
        prop: 'train_class',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAIN_CLASS_OPTIONS,

        },
        importDefaultCol: 'O',
      },
      {
        label: '培训项目负责人',
        prop: 'maintainer',
        ruleNames: ['required'],
        importDefaultCol: 'P',
      },
      {
        label: '培训负责人工号',
        prop: 'maintainer_code',
        ruleNames: ['required'],
        importDefaultCol: 'Q',
      },
      {
        label: '培训地点',
        prop: 'train_place',
        ruleNames: ['required'],
        importDefaultCol: 'R',
      },
    ],
  },
  {
    title: '培训师信息',
    formItems: [
      {
        label: '培训师',
        prop: 'trainer',
        ruleNames: ['required'],
        importDefaultCol: 'S',
      },
      {
        label: '培训师工号/外部师资编号',
        prop: 'trainer_code',
        ruleNames: ['required'],
        importDefaultCol: 'T',
      },
      {
        label: '培训师星级',
        prop: 'trainer_level',
        ruleNames: ['required'],
        customType: 'select',
        customOption: {
          options: common.opts.TRAINER_LEVEL_OPTIONS,
        },
        formValueChangeHandler: salaryHandler,
        importDefaultCol: 'U',
      },
      {
        label: '培训师所属单位',
        prop: 'trainer_company',
        default: '机电三车间',
        disabled: true,
        ruleNames: ['required'],
        importDefaultCol: 'V',
      },
    ],
  },
  {
    title: '培训人数',
    formItems: [
      {
        label: '培训人数',
        prop: 'trained_count_manage',
        customType: 'int',
        tip: '管理和业务技术',
        formValueChangeHandler: totalTrainedHandler,
        importDefaultCol: 'W',
      },
      {
        label: '培训人数',
        prop: 'trained_count_key',
        customType: 'int',
        tip: '行车关键岗位：司机、行车值班员',
        formValueChangeHandler: totalTrainedHandler,
        importDefaultCol: 'X',
      },
      {
        label: '培训人数',
        prop: 'trained_count_product',
        customType: 'int',
        tip: '生产人员：非行车关键岗位',
        formValueChangeHandler: totalTrainedHandler,
        importDefaultCol: 'Y',
      },
      {
        label: '培训人数',
        prop: 'trained_count_new',
        customType: 'int',
        tip: '未持证人员：新员工、实习生等',
        formValueChangeHandler: totalTrainedHandler,
        importDefaultCol: 'Z',
      },
      {
        label: '培训人数',
        prop: 'trained_count_work',
        customType: 'int',
        tip: '工勤',
        formValueChangeHandler: totalTrainedHandler,
        importDefaultCol: 'AA',
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
        ruleNames: ['required', 'notZero'],
        importDefaultCol: 'AB',
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
        ruleNames: ['intUnsigned', 'required'],
        rules: [{
          validatorWithForm: (form: WorkbenchTable) => (r, val, cb) => {
            const min = Math.ceil(+form.trained_count_total * 2 / 3);
            if(val < min) {
              return cb(`需要不少于${min}（培训总人数的2/3）人`);
            }
            return cb();
          },
        }],
        importDefaultCol: 'AF',
      },
      {
        label: '学员评价得分',
        prop: 'student_evaluation_score',
        customType: 'float',
        ruleNames: ['floatUnsigned', 'required'],
        formValueChangeHandler: trainEffectScore,
        importDefaultCol: 'AG',
      },
      {
        label: '项目负责人评价得分',
        prop: 'maintainer_evaluation_score',
        customType: 'float',
        ruleNames: ['floatUnsigned', 'required'],
        formValueChangeHandler: trainEffectScore,
        importDefaultCol: 'AH',
      },
      {
        label: '培训效果评价得分',
        prop: 'effect_evaluation_score',
        tip: '等于学员评价得分*0.7+项目负责人评价得分*0.3',
        customType: 'float',
        ruleNames: ['floatUnsigned', 'required'],
        customOption: {
          controls: false,
        },
        disabled: true,
        importDefaultCol: 'AI',
      },
      {
        label: '培训课酬',
        prop: 'course_pay',
        customType: 'float',
        ruleNames: ['floatUnsigned', 'required'],
        info: '培训师星级系数 * 培训课时',
        importDefaultCol: 'AJ',
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
        importDefaultCol: 'AK',
      },
    ],
  },
];

// 表单初始值
export const FORM_INIT_VALUES = getFormItemInitValues(FORM_ITEMS);
