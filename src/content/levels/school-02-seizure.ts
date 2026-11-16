import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. The first-aid guidance has not been checked by a qualified
 * reviewer (see lesson.reviewer).
 */
const level: LevelDef = {
  id: 'school-02',
  areaId: 'school',
  title: 'Giờ tự học ở thư viện',
  scene: 'Thư viện',

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Giờ tự học, thư viện yên tĩnh ghê. Ai cũng chăm chú ôn bài.',
      mood: 'neutral',
    },
    {
      text: 'Bỗng có tiếng ghế đổ. Vy ngã xuống sàn giữa hai dãy bàn, người cứng lại rồi tay chân giật liên hồi.',
    },
    { speaker: 'Lan', text: 'Vy ơi! Ai đó giữ chặt bạn ấy lại đi!', mood: 'worried' },
    {
      speaker: GUIDE_NAME,
      text: 'Khoan đã, đừng vội giữ! Mình quan sát thật kỹ rồi mới giúp Vy nhé.',
      mood: 'surprised',
    },
  ],

  observe: {
    clues: [
      {
        id: 'limbs',
        label: 'Tay chân',
        caption: 'Tay chân Vy co cứng rồi giật mạnh, không theo ý muốn.',
        x: 56,
        y: 73,
        essential: true,
      },
      {
        id: 'face',
        label: 'Gương mặt',
        caption: 'Mắt Vy trợn lên. Bạn ấy không đáp lại khi được gọi tên.',
        x: 36,
        y: 68,
        essential: true,
      },
      {
        id: 'around',
        label: 'Xung quanh',
        caption: 'Chiếc ghế đổ và chồng sách dày nằm sát đầu Vy, rất dễ va vào.',
        x: 15,
        y: 74,
        essential: true,
      },
      {
        id: 'clock',
        label: 'Đồng hồ treo tường',
        caption: 'Đồng hồ chỉ 9 giờ 10. Nhớ giờ để biết cơn giật kéo dài bao lâu.',
        x: 87,
        y: 11,
        essential: false,
      },
      {
        id: 'bag',
        label: 'Ba lô của Vy',
        caption: 'Trong ba lô có chiếc áo khoác mềm, có thể dùng để lót đầu.',
        x: 79,
        y: 72,
        essential: false,
      },
    ],
  },

  assess: {
    question: 'Chuyện gì đang xảy ra với Vy?',
    options: [
      {
        id: 'faint',
        text: 'Nghi ngờ Vy bị ngất xỉu',
        correct: false,
        feedback: 'Người ngất thường mềm người và nằm yên, còn Vy đang co cứng và giật.',
      },
      {
        id: 'seizure',
        text: 'Nghi ngờ Vy đang lên cơn co giật',
        correct: true,
        feedback:
          'Đúng rồi: ngã đột ngột, người co cứng, tay chân giật và không đáp lại là các dấu hiệu gợi ý cơn co giật.',
      },
      {
        id: 'choking',
        text: 'Nghi ngờ Vy bị hóc dị vật',
        correct: false,
        feedback: 'Vy không ăn uống gì lúc đó, cũng không ôm cổ hay ho sặc.',
      },
      {
        id: 'joke',
        text: 'Vy đang đùa cho cả lớp sợ',
        correct: false,
        feedback: 'Vy ngã mạnh và không đáp lại khi được gọi. Đây không phải trò đùa.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì?',
    order: ['safe', 'cushion', 'call', 'recovery'],
    options: [
      {
        id: 'cushion',
        text: 'Lót áo khoác mềm dưới đầu Vy',
        kind: 'correct',
        feedback: 'Vật mềm dưới đầu giúp Vy không bị đập đầu xuống sàn.',
      },
      {
        id: 'restrain',
        text: 'Giữ chặt tay chân Vy cho hết giật',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Ghì giữ không làm cơn giật dừng lại mà có thể khiến Vy bị thương.',
      },
      {
        id: 'recovery',
        text: 'Khi hết giật, nhẹ nhàng đặt Vy nằm nghiêng và ở bên cạnh bạn ấy',
        kind: 'correct',
        feedback: 'Nằm nghiêng giúp đường thở thông thoáng trong lúc Vy dần tỉnh lại.',
      },
      {
        id: 'crowd',
        text: 'Gọi cả lớp xúm lại xem Vy bị làm sao',
        kind: 'irrelevant',
        feedback:
          'Đám đông vây kín làm Vy thiếu không khí và dễ bị va chạm. Hãy giữ khoảng trống quanh bạn ấy.',
      },
      {
        id: 'safe',
        text: 'Nhìn quanh xem có gì nguy hiểm, dời ghế và đồ cứng ra xa Vy',
        kind: 'correct',
        mandatory: true,
        feedback: 'Dọn trống xung quanh để Vy không va vào đồ vật khi đang giật.',
      },
      {
        id: 'spoon',
        text: 'Nhét thìa hoặc khăn vào miệng để Vy khỏi cắn lưỡi',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Đưa vật gì vào miệng có thể làm gãy răng hoặc bít đường thở của Vy.',
      },
      {
        id: 'call',
        text: 'Xem giờ và nhờ bạn báo cô thủ thư, phòng y tế; sẵn sàng gọi 115',
        kind: 'correct',
        mandatory: true,
        feedback: 'Biết cơn giật kéo dài bao lâu và có người lớn hỗ trợ sớm là rất quan trọng.',
      },
    ],
  },

  act: {
    type: 'drag-place',
    instruction: 'Giữ an toàn cho Vy: đưa từng món đồ đến đúng chỗ. Món không nên dùng thì để yên.',
    zones: [
      { id: 'away', label: 'Góc xa', x: 62, y: 50 },
      { id: 'head', label: 'Dưới đầu Vy', x: 33, y: 64 },
    ],
    items: [
      {
        id: 'chair',
        label: 'Ghế đổ',
        art: 'item-chair',
        zoneId: 'away',
        wrongNote: 'Ghế cần được dời ra góc xa để Vy không va vào.',
      },
      {
        id: 'spoon',
        label: 'Chiếc thìa',
        art: 'item-spoon',
        zoneId: null,
        wrongNote: 'Không đưa vật gì vào miệng người đang co giật.',
      },
      {
        id: 'jacket',
        label: 'Áo khoác mềm',
        art: 'item-soft-jacket',
        zoneId: 'head',
        wrongNote: 'Áo khoác mềm dùng để lót dưới đầu Vy.',
      },
      {
        id: 'water',
        label: 'Chai nước',
        art: 'item-water-bottle',
        zoneId: null,
        wrongNote: 'Không cho uống nước khi Vy chưa tỉnh hẳn: bạn ấy có thể bị sặc.',
      },
      {
        id: 'books',
        label: 'Chồng sách dày',
        art: 'item-books',
        zoneId: 'away',
        wrongNote: 'Đồ cứng cần được dời ra góc xa, không để gần Vy.',
      },
    ],
  },

  outcomes: {
    success:
      'Sau khoảng hai phút, cơn giật dừng lại. Vy nằm nghiêng, thở đều và dần mở mắt. Cô thủ thư và cô y tế đến nơi, khen các bạn đã bình tĩnh và làm đúng.',
    'partial-success':
      'Cơn giật qua đi và Vy được cô y tế chăm sóc. Bạn đã giúp được Vy, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Cô thủ thư và cô y tế đến kịp để chăm sóc Vy. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Cô thủ thư kịp ngăn lại và gọi cô y tế. Những cách làm vừa rồi có thể khiến Vy bị thương hoặc khó thở.',
    timeout: 'Hết giờ! Cô y tế đã đến chăm sóc Vy. Lần sau hãy quyết định nhanh hơn một chút nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra.',
    observe:
      'Chạm vào từng dấu “?” trên hình. Khi đã xem hết những điểm quan trọng, bạn mới kết luận được.',
    assess:
      'Vy ngã đột ngột, người co cứng, tay chân giật và không đáp lại: hãy chọn “Nghi ngờ Vy đang lên cơn co giật”.',
    choose:
      'Thứ tự đúng: dời ghế và đồ cứng ra xa → lót áo mềm dưới đầu → xem giờ, nhờ báo cô thủ thư và y tế → khi hết giật thì đặt Vy nằm nghiêng và ở bên cạnh.',
    act: 'Đưa ghế đổ và chồng sách dày ra “Góc xa”, đưa áo khoác mềm vào “Dưới đầu Vy”. Chiếc thìa và chai nước thì để yên.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-school-02',
    title: 'Co giật',
    levelId: 'school-02',
    areaId: 'school',
    signs: [
      'Ngã đột ngột, mất ý thức, không đáp lại khi được gọi',
      'Người co cứng, sau đó tay chân giật không theo ý muốn',
      'Có thể sùi bọt mép, cắn vào lưỡi hoặc tiểu không tự chủ',
      'Sau cơn thường lơ mơ, mệt và buồn ngủ',
    ],
    principles: [
      'Giữ bình tĩnh và xem giờ lúc cơn giật bắt đầu',
      'Dời bàn ghế, đồ cứng, vật sắc nhọn ra xa nạn nhân',
      'Lót vật mềm dưới đầu, nới lỏng cổ áo, tháo kính nếu có',
      'Khi hết giật, đặt nạn nhân nằm nghiêng để đường thở thông thoáng',
      'Ở bên cạnh, nói chuyện nhẹ nhàng cho đến khi nạn nhân tỉnh hẳn',
      'Báo cho người có trách nhiệm hoặc nhân viên y tế gần nhất',
    ],
    donts: [
      'Không ghì giữ hay đè tay chân nạn nhân',
      'Không đưa bất cứ vật gì vào miệng, kể cả thìa, khăn hay ngón tay',
      'Không cho ăn uống hay uống thuốc khi nạn nhân chưa tỉnh hẳn',
      'Không vây kín, quay phim hay chụp ảnh nạn nhân',
    ],
    callForHelp: [
      'Cơn giật kéo dài quá 5 phút',
      'Có cơn thứ hai nối tiếp, hoặc nạn nhân không tỉnh lại sau cơn',
      'Nạn nhân khó thở hoặc bị thương khi ngã',
      'Đây là lần đầu nạn nhân bị co giật, hoặc bạn không rõ tiền sử',
      'Nạn nhân đang mang thai, hoặc cơn giật xảy ra dưới nước',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
