/**
 * 全站配置（site-config）
 * ------------------------------------------------------------
 * 本文件集中管理网站展示信息与「待江恒律师确认」的字段。
 *
 * 规则（来自建站要求）：
 *  - Person / LegalService 等结构化数据中，不得填入未经确认的信息。
 *  - 以下 author.* 字段为空（''）时表示「待确认」，不会出现在公开页面或
 *    结构化数据中，直到被真实填写。
 *  - display.* 为文章署名与定位中已确认可公开的信息。
 */

export const siteConfig = {
  /**
   * 已书面确认的正式域名（HTTPS）。全站 canonical / og:url / sitemap / RSS / JSON-LD
   * 统一使用此值，不再输出占位链接。
   */
  domain: 'https://jianghenglegal.com', // 已书面确认的正式域名；不写示例/猜测域名。

  /**
   * 作者与执业信息
   *  - realName / email 已确认并填入；其余字段仍为「待确认」（空 = 不展示）。
   */
  author: {
    realName: '江恒', // 已确认真实姓名（用于 Person / Article author / publisher）
    lawFirm: '上海曼昆（深圳）律师事务所', // 已确认执业机构全称
    barAdmission: '', // 待确认：执业地区
    licenseNo: '', // 待确认：执业证号
    email: 'j.heng@hotmail.com', // 已确认：公开邮箱
    phone: '', // 待确认：公开电话
    avatar: '', // 待确认：头像 URL
    social: {
      weibo: '',
      wechat: '',
      linkedin: '',
    },
  },

  /**
   * 已确认展示信息（取自文章署名与定位）
   */
  display: {
    penName: '江恒律师',
    jobTitle: '上海曼昆（深圳）律师事务所律师',
    tagline: '跨境资金、数字人民币与出海合规律师',
    subtitle: '以银行金融、供应链风控与律师实务的复合视角，帮助企业识别资金跨境流动中的支付、账户、反洗钱、制裁、税务、数据与交易证据风险。',
    bio: '上海曼昆（深圳）律师事务所律师，拥有 7 年金融从业经验（5 年国有银行 + 2 年上市供应链企业）与 5 年法律实务经验，关注跨境资金、数字人民币、银行合规、跨境税务与企业出海交易。',
    // 关于页 meta description（避免与 jobTitle/bio 拼接造成重复）
    aboutDescription:
      '江恒律师，拥有 7 年金融从业经验（5 年国有银行 + 2 年上市供应链企业）与 5 年法律实务经验，关注跨境资金、数字人民币、银行合规、跨境税务与企业出海交易。',
    focuses: [
      '跨境资金与账户合规',
      '数字人民币与新型支付',
      '跨境税务、CRS 与资金证据',
      '制裁、供应链与企业出海合规',
    ],
    services: [
      {
        title: '跨境资金八层法律诊断',
        desc: '从交易、主体、货币、支付通道、账户控制、反洗钱与制裁、税务数据、证据救济八层审查资金路径。',
        href: '/cross-border-funds',
        scenario: '跨境收付款、银行补件、复杂账户安排或资金路径需要整体核验。',
        outcome: '形成资金路径图、适用法域表、主体责任矩阵及主要材料缺口清单。',
      },
      {
        title: '数字人民币交易结构审查',
        desc: '审查钱包负债、支付指令、智能合约、平台权限、资金归属与支付业务边界。',
        href: '/articles/digital-renminbi',
        scenario: '企业、平台或技术服务商拟接入数字人民币及可编程支付场景。',
        outcome: '形成交易结构图、系统权限矩阵、合同问题清单及异常处置建议。',
      },
      {
        title: '银行尽调、账户与制裁风险应对',
        desc: '围绕 KYC、UBO、资金来源与用途、贸易真实性、银行限制及制裁节点重组事实和证据。',
        href: '/cross-border-funds',
        scenario: '收到银行补充尽调、付款受阻、账户限制、资金冻结或通道调整要求。',
        outcome: '形成交易时间轴、证据目录、回应框架、节点风险及可讨论的救济路径。',
      },
      {
        title: '跨境税务、CRS 与资金证据',
        desc: '连接税收居民、离岸架构、账户信息交换、资金性质与合同账务证据。',
        href: '/tax-crs',
        scenario: '境外账户、税收居民身份或申报信息需要梳理。',
        outcome: '形成身份与账户关系图、资金性质表、申报连接点及证据差距清单。',
      },
      {
        title: '供应链、原产地与交易真实性',
        desc: '评估东盟等地供应链迁移的原产地认定、关税与证据留存风险。',
        href: '/asean-supply-chain-compliance',
        scenario: '生产采购外移，或收到原产地与单证问询。',
        outcome: '形成六流合一交易图、规则适用清单、单证缺口及后续核验建议。',
      },
    ],
  },

  // 顶部主导航（极简四项）
  nav: [
    { label: '文章', href: '/articles' },
    { label: '服务与能力', href: '/services' },
    { label: '关于江恒', href: '/about' },
    { label: '联系咨询', href: '/contact' },
  ],

  // 栏目页入口（用于首页信息模块与页脚）
  columns: [
    { label: '跨境资金与账户合规', href: '/cross-border-funds' },
    { label: '数字人民币与企业交易', href: '/articles/digital-renminbi' },
    { label: '跨境税务与 CRS', href: '/tax-crs' },
    { label: '企业出海与原产地合规', href: '/outbound-compliance' },
  ],
};

export default siteConfig;
