# 花海 · ChatGPT 桌宠

本目录是 ChatGPT Work Pets 的原生精灵图项目。仓库根目录原来的 Electron 程序只是早期独立窗口实验，不是 ChatGPT 原生桌宠；它不接收 ChatGPT 的任务状态。

已于 2026-10-09 在发起制作请求的账号中创建并启用「花海」，且通过列表回读确认。稳定标识与校验摘要见 [`native-installation.json`](native-installation.json)。这是账号内的安装记录；克隆仓库不会自动改变其他账号的桌宠设置。

本项目按 Pets v2 格式制作：1536×2288、8 列×11 行、每格 192×208、73 个必需帧。背景透明。角色来自用户提供的像素风黑帽、绿衣、背包男孩。

## 状态与造型

| ChatGPT 状态 | 动作 | 图集行 | 帧数 |
|---|---|---|---|
| idle / 待机 | 呼吸、眨眼、轻微歪头三种微动作 | 0 | 6 |
| running-right / 向右拖动 | 面朝屏幕右方交替迈步、摆臂，背包随动 | 1 | 8 |
| running-left / 向左拖动 | 面朝屏幕左方交替迈步、摆臂，背包随动 | 2 | 8 |
| waving / 问候 | 举手挥动后放回 | 3 | 4 |
| jumping / 跳跃 | 下蹲、起跳、腾空、落下、站稳 | 4 | 5 |
| failed / 失败或受阻 | 低头、扶额、慢慢恢复 | 5 | 8 |
| waiting / 等待用户 | 轻歪头摊手，等待输入或批准 | 6 | 6 |
| running / 正在工作或思考 | 托腮、目光上移、手指轻点下巴；脚不动 | 7 | 6 |
| review / 检查结果 | 前倾观察、眯眼检查、轻点头 | 8 | 6 |
| look / 鼠标方向 | 身体固定，头、帽檐与目光自然转向指针 | 9–10 | 16 |

这里的 running 表示工作中，不是脚步奔跑。状态触发与优先级由 ChatGPT 客户端控制，上传精灵图只定义各状态的外观；behavior.json 是可读的映射说明，不会被声称为可注入的客户端规则。

待机的三种微动作编排在客户端支持的一个六帧 idle 循环里，不添加不受支持的额外行，也不承诺自定义随机调度。

鼠标方向从正上方 0° 起，按顺时针每 22.5° 一帧；第 9 行到 157.5°，第 10 行从正下方 180° 到 337.5°。中性正面由 idle 提供。

## 工作文件

- huahai/pet_request.json：角色规格和尺寸。
- huahai/imagegen-jobs.json、prompts/：逐行生成任务与提示词。
- huahai/references/：原图副本、基准形象、布局参考。
- huahai/decoded/：生成的原始动作条。
- huahai/qa/：提帧、逐帧检查、语义和方向连续性检查。
- huahai/final/：校验通过后供 ChatGPT 导入的最终图集与预览。

标准流程使用 work-pets:create-pet 自带的提帧、拼接、清边、校验与预览脚本；具体生成提示保存在每个任务的 prompt_file。

## 已产出文件与校验

- 最终图集：[`huahai/final/spritesheet-extended.png`](huahai/final/spritesheet-extended.png)，透明 PNG，约 1.70 MiB。不要导入带有 `raw` 或 `standard` 后缀的中间文件。
- 动画总览：[`GIF`](huahai/final/previews/all-states.gif) / [`MP4`](huahai/final/previews/all-states.mp4)。九个单状态 GIF、16 方向循环、待机→跳跃→待机循环在同目录。
- 验证记录：`final/validation-extended.json`、`qa/pet-quality.json`、`qa/pets-mcp-validation.json`；方向盲审记录在 `qa/blind-review-*.json`。
- `qa/rows/running-right/` 保留了被否决的早期步态尝试。最终采用三分之四视角的交替小步，以 `qa/standard-semantics.md`、`qa/final-visual-review.md` 和最终校验报告为准。部分接近水平/垂直的斜向转头较细微，已如实保留审查警告。
- 最终主体站立高度约 162 像素，保持 192×208 原生单元格；跳跃预留上方空间。不是扩大透明窗口再放大人物。

Pillow 11.0 在本机 Python 3.13 下出现 GIF 调色板错误；制作使用隔离 `.pet-runtime` 与 `requirements.txt` 所列版本，未修改系统 Python 的 Pillow。`register_standard_rows.py` 调用技能自带几何归一化函数，不重绘角色；`export_previews.py` 只从最终编码图集导出播放预览。

原始参考 01–03 用于角色身份约束；04（坐着喝饮料）额外保存为原始资料。本版原生状态不引入椅子、饮料或行李箱，以保持所有状态之间角色和道具一致。

生成属于基于参考图的像素形象延展，不是原图逐像素复刻。最终背景透明；原始动作条中的品红色只是制作时用于去背的背景，不能作为桌宠导入。
