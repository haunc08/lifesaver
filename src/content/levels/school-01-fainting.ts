import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. Written to exercise the level engine end to end; the first-aid
 * guidance has not been checked by a qualified reviewer (see lesson.reviewer).
 */
const level: LevelDef = {
  id: 'school-01',
  areaId: 'school',
  title: 'Tiết bốn oi ả',
  scene: 'Lớp học',
  timeLimitSec: 90,

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Tiết bốn rồi mà phòng học vẫn đóng kín cửa, nóng ghê!',
      mood: 'neutral',
    },
    { speaker: 'Nam', text: 'Tớ thấy hơi chóng mặt… Sáng nay tớ chưa kịp ăn gì.', mood: 'worried' },
    { text: 'Nam vừa đứng dậy thì loạng choạng rồi khuỵu xuống cạnh bàn.' },
    {
      speaker: GUIDE_NAME,
      text: 'Bình tĩnh nào. Quan sát kỹ trước khi làm gì nhé!',
      mood: 'surprised',
    },
  ],

  observe: {
    required: 3,
    clues: [
      {
        id: 'face',
        label: 'Gương mặt',
        caption: 'Mặt Nam tái nhợt, trán vã mồ hôi.',
        x: 64,
        y: 58,
      },
      {
        id: 'chest',
        label: 'Lồng ngực',
        caption: 'Ngực Nam vẫn phập phồng đều: bạn ấy vẫn đang thở.',
        x: 67,
        y: 74,
      },
      {
        id: 'limbs',
        label: 'Tay chân',
        caption: 'Tay chân Nam mềm, không co cứng hay giật.',
        x: 53,
        y: 84,
      },
      {
        id: 'room',
        label: 'Phòng học',
        caption: 'Cửa sổ đóng kín, phòng rất nóng. Hộp đồ ăn sáng của Nam còn nguyên.',
        x: 15,
        y: 30,
      },
    ],
  },

  assess: {
    question: 'Chuyện gì đang xảy ra với Nam?',
    options: [
      {
        id: 'faint',
        text: 'Nghi ngờ Nam bị ngất xỉu',
        correct: true,
        feedback:
          'Đúng rồi: chóng mặt, mặt tái, vã mồ hôi rồi ngã quỵ là các dấu hiệu gợi ý ngất xỉu.',
      },
      {
        id: 'seizure',
        text: 'Nam đang lên cơn co giật',
        correct: false,
        feedback: 'Tay chân Nam mềm, không co cứng hay giật.',
      },
      {
        id: 'choking',
        text: 'Nam bị hóc dị vật',
        correct: false,
        feedback: 'Nam không ăn uống gì lúc đó và vẫn thở đều.',
      },
      {
        id: 'sleep',
        text: 'Nam chỉ ngủ gật thôi',
        correct: false,
        feedback: 'Ngã đột ngột, mặt tái và vã mồ hôi không phải là ngủ gật.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì? Chọn các việc theo đúng thứ tự.',
    order: ['safe', 'check', 'call', 'lay'],
    options: [
      {
        id: 'lay',
        text: 'Đặt Nam nằm ngửa, kê chân cao hơn một chút',
        kind: 'correct',
        feedback: 'Nằm ngửa và kê cao chân giúp máu về não dễ hơn.',
      },
      {
        id: 'sugar',
        text: 'Đổ nước đường vào miệng Nam ngay',
        kind: 'unsafe',
        feedback: 'Không an toàn! Người chưa tỉnh hẳn có thể bị sặc nếu cho ăn uống.',
      },
      {
        id: 'safe',
        text: 'Nhìn quanh xem có gì nguy hiểm, dẹp bàn ghế ra xa',
        kind: 'correct',
        mandatory: true,
        feedback: 'Luôn kiểm tra an toàn xung quanh trước khi lại gần.',
      },
      {
        id: 'video',
        text: 'Quay video gửi vào nhóm lớp',
        kind: 'irrelevant',
        feedback: 'Việc này không giúp gì cho Nam, và không tôn trọng người gặp nạn.',
      },
      {
        id: 'call',
        text: 'Nhờ bạn báo thầy cô và phòng y tế; sẵn sàng gọi 115',
        kind: 'correct',
        mandatory: true,
        feedback: 'Gọi người hỗ trợ sớm để Nam được chăm sóc đúng cách.',
      },
      {
        id: 'lay-flat',
        text: 'Đặt Nam nằm ngửa trên sàn',
        kind: 'partial',
        substitutes: 'lay',
        feedback: 'Nằm ngửa là đúng, nhưng kê cao chân nữa thì tốt hơn.',
      },
      {
        id: 'check',
        text: 'Gọi tên, vỗ nhẹ vai và xem Nam có thở bình thường không',
        kind: 'correct',
        mandatory: true,
        feedback: 'Kiểm tra đáp ứng và nhịp thở cho biết tình trạng nặng hay nhẹ.',
      },
      {
        id: 'shake',
        text: 'Xốc Nam ngồi dậy và lay thật mạnh',
        kind: 'unsafe',
        feedback: 'Không an toàn! Xốc dậy và lay mạnh có thể làm Nam ngã lần nữa hoặc bị thương.',
      },
    ],
  },

  act: {
    type: 'tap-targets',
    instruction: 'Giúp Nam dễ chịu hơn: chạm vào những chỗ cần xử lý.',
    targets: [
      { id: 'legs', label: 'Kê ba lô dưới chân', x: 72, y: 86 },
      { id: 'collar', label: 'Nới lỏng cổ áo', x: 56, y: 68 },
      { id: 'window', label: 'Mở cửa sổ', x: 24, y: 28 },
    ],
  },

  outcomes: {
    success:
      'Nam từ từ mở mắt. Thầy giáo và cô y tế đến nơi, khen cả lớp đã giữ bình tĩnh và làm đúng thứ tự.',
    'partial-success':
      'Nam tỉnh lại và được cô y tế đưa đi nghỉ. Bạn đã giúp được Nam, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Cô y tế đến kịp và chăm sóc Nam. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Thầy giáo kịp ngăn lại và gọi cô y tế. Những cách làm vừa rồi có thể khiến Nam gặp nguy hiểm hơn.',
    timeout: 'Hết giờ! Cô y tế đã đến chăm sóc Nam. Lần sau hãy quyết định nhanh hơn một chút nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra.',
    observe: 'Chạm vào các điểm sáng trên hình. Cần xem ít nhất 3 manh mối trước khi kết luận.',
    assess:
      'Nam chóng mặt, mặt tái, vã mồ hôi, vẫn thở đều và không co giật: hãy chọn “Nghi ngờ Nam bị ngất xỉu”.',
    choose:
      'Thứ tự đúng: kiểm tra an toàn → gọi tên và xem nhịp thở → nhờ báo thầy cô, y tế → đặt nằm ngửa, kê cao chân.',
    act: 'Chạm lần lượt vào ba chỗ: ba lô để kê chân, cổ áo và cửa sổ.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-school-01',
    title: 'Ngất xỉu',
    levelId: 'school-01',
    areaId: 'school',
    signs: [
      'Chóng mặt, hoa mắt, buồn nôn trước khi ngã',
      'Da tái nhợt, vã mồ hôi lạnh',
      'Mất ý thức trong thời gian ngắn, tay chân mềm',
    ],
    principles: [
      'Kiểm tra an toàn xung quanh trước khi lại gần',
      'Gọi hỏi và kiểm tra xem nạn nhân có thở bình thường không',
      'Báo cho người có trách nhiệm hoặc nhân viên y tế gần nhất',
      'Đặt nạn nhân nằm ngửa, kê cao chân nếu không nghi ngờ chấn thương',
      'Nới lỏng quần áo chật và giữ cho không gian thoáng khí',
      'Khi tỉnh lại, để nạn nhân nằm nghỉ thêm vài phút rồi mới từ từ ngồi dậy',
    ],
    donts: [
      'Không cho ăn uống khi nạn nhân chưa tỉnh hẳn',
      'Không xốc dậy, lay mạnh hay tát vào mặt',
      'Không vây kín xung quanh nạn nhân',
    ],
    callForHelp: [
      'Nạn nhân không tỉnh lại sau khoảng một phút',
      'Nạn nhân không thở hoặc thở bất thường',
      'Nạn nhân bị thương khi ngã, nhất là ở vùng đầu',
      'Có đau ngực, khó thở, co giật, hoặc nạn nhân đang mang thai',
      'Ngất lặp lại nhiều lần',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
