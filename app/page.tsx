"use client";

import { useMemo, useState } from "react";
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
  investmentValue: string;
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

type CategoryId = "all" | "pipeline" | "financing" | "bd" | "people";

const data = intelligenceData as IntelligenceData;
const latest = data.reports[0];

const categories = [
  {
    id: "pipeline" as const,
    index: "01",
    eyebrow: "PIPELINE & CLINICAL",
    title: "管线与临床",
    copy: "覆盖 siRNA、ASO、miRNA、适配体、偶联物与递送技术，追踪阶段变化和关键数据。",
  },
  {
    id: "financing" as const,
    index: "02",
    eyebrow: "FINANCING & CAPITAL",
    title: "融资与资本",
    copy: "拆分融资轮次、原币种金额、投资方与资金用途，不将未披露信息作推测。",
  },
  {
    id: "bd" as const,
    index: "03",
    eyebrow: "BD & DEALS",
    title: "BD 与交易",
    copy: "逐项记录首付款、里程碑、股权投资、总交易额，以及授权区域和权益边界。",
  },
  {
    id: "people" as const,
    index: "04",
    eyebrow: "PEOPLE & ORGANISATIONS",
    title: "人物与组织",
    copy: "识别公司、机构、核心人物及职务，把事件放回真实的产业关系中理解。",
  },
];

const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<Exclude<CategoryId, "all">, (typeof categories)[number]>;

const emptyValues = [
  "",
  "-",
  "—",
  "无",
  "暂无",
  "不适用",
  "未披露",
  "未发现",
];

function hasSignal(value: string) {
  const normalized = value.trim();
  return !emptyValues.some(
    (empty) => normalized === empty || normalized.startsWith(`${empty}。`),
  );
}

function getItemCategories(item: NewsItem) {
  const tags: Exclude<CategoryId, "all">[] = [];

  if (
    [item.asset, item.modalityTarget, item.stage, item.pipelineProgress].some(
      hasSignal,
    )
  ) {
    tags.push("pipeline");
  }
  if (hasSignal(item.financing)) tags.push("financing");
  if (hasSignal(item.bd)) tags.push("bd");
  if (hasSignal(item.people)) tags.push("people");

  return tags.length > 0 ? tags : (["pipeline"] as const);
}

function getPrimaryCategory(item: NewsItem) {
  if (hasSignal(item.bd)) return "bd" as const;
  if (hasSignal(item.financing)) return "financing" as const;
  if (
    [item.asset, item.modalityTarget, item.stage, item.pipelineProgress].some(
      hasSignal,
    )
  ) {
    return "pipeline" as const;
  }
  return "people" as const;
}

function formatCardDate(value: string) {
  return value.replaceAll("-", "/");
}

const sourceGroups = [
  "公司公告与交易所披露",
  "监管机构与临床登记",
  "论文及会议官方信息",
  "全球医药行业媒体",
  "企业与行业公众号",
  "搜狗微信与搜狐等替代渠道",
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const stories = useMemo(
    () =>
      data.reports.flatMap((report) =>
        report.items.map((item) => ({
          ...item,
          reportDate: report.date,
          tags: getItemCategories(item),
          primaryCategory: getPrimaryCategory(item),
        })),
      ),
    [],
  );

  const filteredStories = useMemo(
    () =>
      activeCategory === "all"
        ? stories
        : stories.filter((story) => story.tags.includes(activeCategory)),
    [activeCategory, stories],
  );

  const activeLabel =
    activeCategory === "all" ? "全部情报" : categoryById[activeCategory].title;

  return (
    <main id="top">
      <header className="masthead page-shell">
        <a className="wordmark" href="#top" aria-label="返回页面顶部">
          Oligo Intelligence
          <small>每日8:00首发 · 每4小时更新</small>
        </a>

        <div className="masthead-actions">
          <span className="source-note">信源可核查</span>
          <nav className="view-switch" aria-label="页面导航">
            <a className="is-active" href="#stream">情报</a>
            <a href="#archive">归档</a>
            <a href="#method">方法</a>
          </nav>
          <span className="cadence">8:00 · 4H</span>
        </div>
      </header>

      <section className="intro page-shell" aria-labelledby="page-title">
        <div>
          <p className="intro-kicker">GLOBAL SMALL RNA SIGNALS</p>
          <h1 id="page-title">每日8:00首发，每4小时看全球小核酸产业变化。</h1>
        </div>
        <div className="intro-meta">
          <span className="live-dot"><i aria-hidden="true" />{data.status}</span>
          <p>{data.lastUpdated ? `最近更新 ${data.lastUpdated}` : "等待首期更新"}</p>
        </div>
      </section>

      <section className="category-section page-shell" aria-labelledby="category-title">
        <div className="section-line">
          <div>
            <span>01—04</span>
            <h2 id="category-title">按标签筛选</h2>
          </div>
          <button
            className={`all-filter ${activeCategory === "all" ? "is-active" : ""}`}
            type="button"
            aria-pressed={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          >
            全部情报 · {stories.length}
          </button>
        </div>

        <div className="category-grid">
          {categories.map((category) => {
            const count = stories.filter((story) =>
              story.tags.includes(category.id),
            ).length;
            const isActive = activeCategory === category.id;

            return (
              <button
                className={`category-card category-${category.id} ${
                  isActive ? "is-active" : ""
                }`}
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-cover" aria-hidden="true">
                  <i className="cover-label">{category.eyebrow}</i>
                  <b>{category.index}</b>
                  <i className="cover-orbit orbit-a" />
                  <i className="cover-orbit orbit-b" />
                  <i className="cover-core" />
                </span>
                <span className="category-body">
                  <span className="card-meta">
                    <i>{category.eyebrow}</i>
                    <i>{String(count).padStart(2, "0")} ITEMS</i>
                  </span>
                  <strong>{category.index} {category.title}</strong>
                  <span>{category.copy}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="stream-section page-shell" id="stream" aria-labelledby="stream-title">
        <div className="section-line stream-heading">
          <div>
            <span>LATEST SIGNALS</span>
            <h2 id="stream-title">{activeLabel}</h2>
          </div>
          <p>{data.schedule} · {data.timezone} · 一手来源优先</p>
        </div>

        {filteredStories.length > 0 ? (
          <div className="story-grid">
            {filteredStories.map((story) => {
              const category = categoryById[story.primaryCategory];
              return (
                <article
                  className={`story-card story-${story.primaryCategory}`}
                  key={`${story.company}-${story.asset}-${story.sourceUrl}`}
                >
                  <div className="story-cover" aria-hidden="true">
                    <span>{category.eyebrow}</span>
                    <b>{story.company}</b>
                    <i>{category.index}</i>
                  </div>
                  <div className="story-body">
                    <div className="card-meta">
                      <span>{category.title}</span>
                      <time>{formatCardDate(story.publishedTime || story.reportDate)}</time>
                    </div>
                    <h3>{story.asset !== "未披露" ? `${story.company} · ${story.asset}` : story.company}</h3>
                    <p>{story.summary}</p>
                    {story.investmentValue && (
                      <div className="investment-box">
                        <span>投资价值</span>
                        <p>{story.investmentValue}</p>
                      </div>
                    )}
                    <dl>
                      <div><dt>地区</dt><dd>{story.region}</dd></div>
                      <div><dt>阶段</dt><dd>{story.stage}</dd></div>
                      {story.primaryCategory === "financing" && (
                        <div><dt>融资</dt><dd>{story.financing}</dd></div>
                      )}
                      {story.primaryCategory === "bd" && (
                        <div><dt>交易</dt><dd>{story.bd}</dd></div>
                      )}
                      {story.primaryCategory === "people" && (
                        <div><dt>人物</dt><dd>{story.people}</dd></div>
                      )}
                    </dl>
                    <div className="story-footer">
                      <span>{story.verification}</span>
                      <a href={story.sourceUrl} target="_blank" rel="noreferrer">
                        {story.sourceName} ↗
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-stream">
            <span className="empty-cover" aria-hidden="true">
              <i />
              <i />
              <b>NO MATERIAL UPDATE</b>
            </span>
            <div>
              <p>LAST CHECKED · {latest?.generatedAt ?? "等待更新"}</p>
              <h3>{activeCategory === "all" ? "本小时未发现实质性新增" : `${activeLabel}暂无新增`}</h3>
              <span>已完成既定来源检查，不使用旧闻填充情报流。每日8:00首发，每4小时会自动重新检索、核验并发布。</span>
            </div>
          </div>
        )}

        {latest && (
          <aside className="hourly-brief" aria-label="最近一次情报摘要">
            <div>
              <span>{latest.date}</span>
              <h3>最近一次检查</h3>
            </div>
            <ol>
              {latest.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ol>
          </aside>
        )}
      </section>

      <section className="archive-section page-shell" id="archive" aria-labelledby="archive-title">
        <div className="section-line">
          <div>
            <span>ARCHIVE</span>
            <h2 id="archive-title">历史归档</h2>
          </div>
          <p>以北京时间自然日归档，同一事件的新进展明确标记为“更新”。</p>
        </div>
        <div className="archive-grid">
          {data.reports.map((report) => (
            <article key={report.date}>
              <span>{formatCardDate(report.date)}</span>
              <strong>{report.items.length} 条实质性动态</strong>
              <p>{report.highlights[0] || "当日未发现实质性新增"}</p>
              <small>{report.generatedAt}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="method-section" id="method" aria-labelledby="method-title">
        <div className="page-shell method-grid">
          <div className="method-copy">
            <span>RESEARCH STANDARD</span>
            <h2 id="method-title">来源可追溯，事实有边界。</h2>
            <p>优先核查公司、监管、临床登记和会议等一手信息。公司口径、媒体报道与传闻分开标注；金额保留原币种，未知项不作推测。</p>
          </div>
          <div className="source-list">
            {sourceGroups.map((source, index) => (
              <div key={source}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{source}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="page-shell footer-inner">
          <a className="wordmark footer-wordmark" href="#top">
            Oligo Intelligence
            <small>公开信息研究工具 · 不构成医疗或投资建议</small>
          </a>
          <span>{data.schedule} · 每4小时自动更新</span>
          <a href="#top">回到顶部 ↑</a>
        </div>
      </footer>
    </main>
  );
}
