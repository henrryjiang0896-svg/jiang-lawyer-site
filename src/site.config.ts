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
    tagline: '跨境税务与出海合规律师',
    subtitle: '以金融与法律的复合视角，帮助企业与创业者识别跨境资金、税务、供应链与账户合规风险。',
    bio: '上海曼昆（深圳）律师事务所律师，拥有 7 年金融从业经验（5 年国有银行 + 2 年上市供应链企业）与 5 年法律实务经验，专注跨境税务、企业出海合规与跨境资金账户。',
    // 关于页 meta description（避免与 jobTitle/bio 拼接造成重复）
    aboutDescription:
      '江恒律师，拥有 7 年金融从业经验（5 年国有银行 + 2 年上市供应链企业）与 5 年法律实务经验，专注跨境税务、企业出海合规与跨境资金账户。',
    focuses: [
      '跨境税务与 CRS',
      '企业出海合规（供应链与原产地）',
      '跨境资金与账户合规',
      '制裁与贸易合规初步评估',
    ],
    services: [
      {
        title: '跨境税务与 CRS 风险梳理',
        desc: '协助梳理税收居民身份、境外账户信息申报与离岸架构的合规风险。',
      },
      {
        title: '供应链与原产地合规',
        desc: '评估东盟等地供应链迁移的原产地认定、关税与证据留存风险。',
      },
      {
        title: '跨境资金与账户合规',
        desc: '协助理解银行尽调、账户受限与跨境收款的合规路径。',
      },
      {
        title: '制裁与贸易合规初步评估',
        desc: '就美国关税、出口管制与贸易救济措施的适用作初步梳理。',
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
    { label: '跨境税务与 CRS', href: '/tax-crs' },
    { label: '企业出海与原产地合规', href: '/outbound-compliance' },
    { label: '跨境资金与账户合规', href: '/cross-border-funds' },
  ],
};

export default siteConfig;
