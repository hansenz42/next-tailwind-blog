# Attention 示例来源记录

用于博客示例核查，不作为文章正文。原项目：`/Users/hans/workspace/miremo`。

处理链：`20261022-jate-extraction/tables` 的 994 条预选 → `workflow-v8-20261024-reading-run01` 细读及其保存的 Meta → `20261024-candidate-refinement/run-03` → `20261024-candidate-denoise/run-03/04-delivery` 的 160 条候选。两阶段 manifest 的 source 已核对；预选和细读的 document_version 一致。细读 manifest 记录 Meta 复用自 workflow-v7，本文使用细读状态中实际保存的 Meta，不混入 20261021 的旧分片 Meta。

`excerpts.json` 保存三个预选条目、文章 Meta、两个章节 Meta、一条细读关联和对应交付条目的原始内容，以及源文件 SHA-256。Meta 的 ontology 关注项从按类型 ID 索引改为 ontology_specific，避免公开内部类型 ID；不改变字段内容。章节标题来自 tables/chapters.json。

正文 Meta 按句节选并明确标记；候选 JSON 为字段投影，仅保留第一处 mentions；定义保留原文。未使用新模型生成或人为补造实验结果。此为历史测试产物，非当前生产版本或最终知识库采纳。模型 Meta 中的范围判断及最终定义仍属待评审输出，不作准确率承诺。

论文使用 arXiv 稳定链接，未将内部文档哈希推断为 arXiv 版本号。原始字符偏移已对照 shards.json 中实际文本检查。
