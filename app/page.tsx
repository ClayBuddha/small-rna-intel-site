import intelligenceData from "@/data/reports.json";

type NewsItem = {
  company: string;
  people: string;
  eventTime: string;
  publishedTime: string;
  region: string;
  asset: string;
  modalityTarget: string;
  stage: string;
  pipelineProgress: string;
  financing: string;
  bd: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  verification: string;
};

type DailyReport = {
  date: string;
  generatedAt: string;
  highlights: string[];
  items: NewsItem[];
  financingSummary: string;
  bdSummary: string;
  checkedSources: string[];
};

type IntelligenceData = {
  schedule: string;
  timezone: string;
  status: string;
  lastUpdated: string | null;
  reports: DailyReport[];
};

const data = intelligenceData as IntelligenceData;
const latest = data.reports[0];

const coverage = [
  {
    index: "01",
    title: "管线与临床",
    copy: "覆盖 siRNA、ASO、miRNA、适配体、偶联物与递送技术，追踪阶段变化和关键数据。",
  },
  {
    index: "02",
    title: "融资与资本",
    copy: "拆分融资轮次、原币种金额、投资方与资金用途，不将未披露信息作推测。",
  },
  {
    index: "03",
    title: "BD 与交易",
    copy: "逐项记录首付款、里程碑、股权投资、总交易额，以及授权区域和权益边界。",
  },
  {
    index: "04",
    title: "人物与组织",
    copy: "识别公司、机构、核心人物及职务，把事件放回真实的产业关系中理解。",
  },
];

const sourceGroups = [
  "公司公告与交易所披露",
  "监管机构与临床登记",
  "论文及会议官方信息",
  "全球医药行业媒体",
  "企业与行业公众号",
  "搜狗微信与搜狐等替代渠道",
];

export default function Home() {
  return (
    <main>
      <header className="site-header shell">
        <a className="brand" href="#top" aria-label="返回首页顶部">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            <strong>核酸前线</strong>
            <small>OLIGO INTELLIGENCE</small>
          </span>
        </a>
        <nav aria-label="页面导航">
          <a href="#latest">最新日报</a>
          <a href="#coverage">监测范围</a>
          <a href="#method">方法说明</a>
        </nav>
        <span className="live-pill">
          <i aria-hidden="true" /> {data.status}
        </span>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">GLOBAL SMALL RNA DRUG INTELLIGENCE</p>
          <h1>
            每日看清
            <span>小核酸药物</span>
            全球进展
          </h1>
          <p className="hero-lede">
            从药物管线、临床数据到融资与 BD，把分散在全球公告、监管信息和中文行业渠道中的信号，整理成一张可核查的产业地图。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#latest">
              查看最新日报 <span aria-hidden="true">↘</span>
            </a>
            <p>
              <strong>{data.schedule}</strong>
              <span>{data.timezone}自动更新</span>
            </p>
          </div>
        </div>

        <div className="signal-card" aria-label="日报监测概览">
          <div className="signal-topline">
            <span>DAILY SIGNAL</span>
            <span>{latest ? latest.date : "READY"}</span>
          </div>
          <div className="orbit" aria-hidden="true">
            <span className="orbit-ring ring-one" />
            <span className="orbit-ring ring-two" />
            <span className="nucleus" />
            <span className="particle particle-one" />
            <span className="particle particle-two" />
            <span className="particle particle-three" />
          </div>
          <div className="signal-grid">
            <div>
              <strong>24h</strong>
              <span>核心监测窗口</span>
            </div>
            <div>
              <strong>6</strong>
              <span>来源类型</span>
            </div>
            <div>
              <strong>1st</strong>
              <span>一手来源优先</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="监测主题">
        <div>
          <span>siRNA</span><i>●</i><span>ASO</span><i>●</i><span>RNAi</span><i>●</i>
          <span>miRNA</span><i>●</i><span>APTAMER</span><i>●</i><span>DELIVERY</span><i>●</i>
          <span>FINANCING</span><i>●</i><span>BD &amp; LICENSING</span>
        </div>
      </section>

      <section className="latest-section shell" id="latest">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LATEST BRIEFING</p>
            <h2>最新日报</h2>
          </div>
          <p className="update-stamp">
            {data.lastUpdated ? `更新于 ${data.lastUpdated}` : "等待首期自动更新"}
          </p>
        </div>

        {latest ? (
          <>
            <div className="briefing-head">
              <div>
                <span>{latest.date}</span>
                <h3>今日要点</h3>
              </div>
              <ol>
                {latest.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ol>
            </div>

            {latest.items.length > 0 ? (
              <div className="table-wrap" tabIndex={0} aria-label="可横向滚动的日报明细表">
                <table>
                  <thead>
                    <tr>
                      <th>公司 / 机构</th>
                      <th>核心人物</th>
                      <th>时间</th>
                      <th>地区</th>
                      <th>药物 / 项目</th>
                      <th>技术 / 靶点</th>
                      <th>阶段与进展</th>
                      <th>融资</th>
                      <th>BD / 交易</th>
                      <th>事件摘要</th>
                      <th>来源</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latest.items.map((item) => (
                      <tr key={`${item.company}-${item.asset}-${item.sourceUrl}`}>
                        <td><strong>{item.company}</strong><em>{item.verification}</em></td>
                        <td>{item.people}</td>
                        <td>{item.eventTime}<small>报道：{item.publishedTime}</small></td>
                        <td>{item.region}</td>
                        <td>{item.asset}</td>
                        <td>{item.modalityTarget}</td>
                        <td><strong>{item.stage}</strong><small>{item.pipelineProgress}</small></td>
                        <td>{item.financing}</td>
                        <td>{item.bd}</td>
                        <td>{item.summary}</td>
                        <td><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceName} ↗</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-news">
                <span>NO MATERIAL UPDATE</span>
                <h3>今日未发现实质性新增</h3>
                <p>已完成既定来源检查，不使用旧闻填充日报。</p>
              </div>
            )}

            <div className="deal-summary">
              <div><span>融资摘要</span><p>{latest.financingSummary}</p></div>
              <div><span>BD 摘要</span><p>{latest.bdSummary}</p></div>
            </div>
          </>
        ) : (
          <div className="launch-state">
            <div className="launch-index">01</div>
            <div>
              <span className="status-label">AUTOMATION READY</span>
              <h3>首期日报将在每日 18:00 更新后出现</h3>
              <p>监测、核验、去重和结构化规则已经就绪。首期完成后，这里将展示今日要点、新闻明细、融资和 BD 汇总。</p>
            </div>
            <div className="field-preview" aria-label="即将展示的主要字段">
              {[
                "公司与人物", "事件与报道时间", "药物与靶点", "临床阶段", "融资金额", "BD 条款", "来源链接", "核验状态",
              ].map((field) => <span key={field}>{field}</span>)}
            </div>
          </div>
        )}
      </section>

      <section className="coverage-section" id="coverage">
        <div className="shell">
          <div className="section-heading light-heading">
            <div>
              <p className="eyebrow">SIGNAL MAP</p>
              <h2>四条产业主线，一次读完</h2>
            </div>
            <p>不止收集新闻，更保留判断一条消息是否值得关注所需的关键上下文。</p>
          </div>
          <div className="coverage-grid">
            {coverage.map((item) => (
              <article key={item.index}>
                <span>{item.index}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="archive-section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ARCHIVE</p>
            <h2>历史归档</h2>
          </div>
          <p>每期日报按北京时间归档，同一事件的新进展会明确标记为“更新”。</p>
        </div>
        {data.reports.length > 0 ? (
          <div className="archive-grid">
            {data.reports.map((report) => (
              <article key={report.date}>
                <span>{report.date}</span>
                <h3>{report.items.length} 条实质性动态</h3>
                <p>{report.highlights[0] || "今日未发现实质性新增"}</p>
                <small>{report.generatedAt}</small>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-archive">首期日报发布后，将在这里形成连续可查的每日档案。</div>
        )}
      </section>

      <section className="method-section shell" id="method">
        <div className="method-copy">
          <p className="eyebrow">RESEARCH STANDARD</p>
          <h2>来源可追溯，事实有边界</h2>
          <p>优先核查公司、监管、临床登记和会议等一手信息。公司口径、媒体报道与传闻分开标注；金额保留原币种，未知项不作推测。</p>
        </div>
        <div className="source-list">
          {sourceGroups.map((source, index) => (
            <div key={source}><span>{String(index + 1).padStart(2, "0")}</span>{source}</div>
          ))}
        </div>
      </section>

      <footer>
        <div className="shell">
          <div className="brand footer-brand">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span><strong>核酸前线</strong><small>OLIGO INTELLIGENCE</small></span>
          </div>
          <p>公开信息研究工具 · 不构成医疗或投资建议</p>
          <a href="#top">回到顶部 ↑</a>
        </div>
      </footer>
    </main>
  );
}
