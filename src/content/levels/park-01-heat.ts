import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. The first-aid guidance has not been checked by a qualified
 * reviewer (see lesson.reviewer).
 */
const level: LevelDef = {
  id: 'park-01',
  areaId: 'park',
  title: 'Chạy bộ giữa trưa',
  scene: 'Đường chạy bộ',
  timeLimitSec: 100,

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Mười hai giờ trưa mà đường chạy vẫn có người tập. Nắng chang chang luôn!',
      mood: 'neutral',
    },
    {
      speaker: 'Anh Khoa',
      text: 'Anh chạy được tám vòng rồi… mà sao chân cứ rút lại, đầu thì quay quay.',
      mood: 'pain',
    },
    { text: 'Anh Khoa loạng choạng rồi ngồi phịch xuống mép đường chạy, mồ hôi ướt đẫm áo.' },
    {
      speaker: GUIDE_NAME,
      text: 'Anh ấy vẫn tỉnh và nói chuyện được. Mình xem kỹ đã rồi hãy giúp nhé!',
      mood: 'worried',
    },
  ],

  observe: {
    required: 3,
    clues: [
      {
        id: 'sun',
        label: 'Trời nắng',
        caption: 'Đang giữa trưa, nắng rất gắt. Đoạn đường chạy này không có chút bóng râm nào.',
        x: 82,
        y: 15,
      },
      {
        id: 'face',
        label: 'Gương mặt',
        caption: 'Mặt anh Khoa tái, mồ hôi chảy ròng ròng. Da sờ vào thấy mát và ẩm.',
        x: 68,
        y: 50,
      },
      {
        id: 'talk',
        label: 'Lời nói',
        caption:
          'Anh Khoa trả lời rõ ràng, biết mình đang ở đâu, nhưng kêu chóng mặt, buồn nôn và rất khát.',
        x: 53,
        y: 58,
      },
      {
        id: 'legs',
        label: 'Bắp chân',
        caption: 'Hai bắp chân anh Khoa căng cứng vì chuột rút. Không thấy sưng hay vết thương.',
        x: 79,
        y: 80,
      },
      {
        id: 'bottle',
        label: 'Bình nước',
        caption: 'Bình nước của anh Khoa đã cạn khô từ lâu.',
        x: 23,
        y: 87,
      },
    ],
  },

  assess: {
    question: 'Chuyện gì đang xảy ra với anh Khoa?',
    options: [
      {
        id: 'sprain',
        text: 'Anh Khoa bị bong gân cổ chân',
        correct: false,
        feedback:
          'Cả hai bắp chân đều bị chuột rút, cổ chân không sưng và anh ấy không bị trẹo chân.',
      },
      {
        id: 'heat',
        text: 'Nghi ngờ anh Khoa bị kiệt sức vì nóng',
        correct: true,
        feedback:
          'Đúng rồi: vận động lâu dưới nắng, vã mồ hôi, da tái, chóng mặt, chuột rút nhưng vẫn tỉnh là các dấu hiệu gợi ý kiệt sức vì nóng.',
      },
      {
        id: 'tired',
        text: 'Anh Khoa chỉ hơi mệt, nghỉ một phút là chạy tiếp được',
        correct: false,
        feedback:
          'Chóng mặt, buồn nôn và chuột rút dưới trời nắng gắt không phải là mệt thông thường.',
      },
      {
        id: 'sting',
        text: 'Nghi ngờ anh Khoa bị ong đốt',
        correct: false,
        feedback: 'Trên người anh Khoa không có vết đốt hay chỗ sưng đỏ nào.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì? Chọn các việc theo đúng thứ tự.',
    order: ['safe', 'shade', 'call', 'cool'],
    options: [
      {
        id: 'cool',
        text: 'Đắp khăn ướt, quạt mát và cho anh Khoa uống từng ngụm nước nhỏ',
        kind: 'correct',
        feedback: 'Làm mát từ từ và bù nước từng ngụm giúp cơ thể hạ nhiệt an toàn.',
      },
      {
        id: 'run',
        text: 'Động viên anh Khoa cố chạy nốt cho ra hết mồ hôi',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Tiếp tục vận động dưới nắng có thể khiến kiệt sức chuyển thành say nắng nguy hiểm.',
      },
      {
        id: 'safe',
        text: 'Nhìn quanh đường chạy, ra hiệu cho xe đạp và người chạy tránh ra',
        kind: 'correct',
        mandatory: true,
        feedback: 'Luôn kiểm tra an toàn xung quanh trước khi lại gần giúp đỡ.',
      },
      {
        id: 'stats',
        text: 'Bấm đồng hồ xem anh Khoa đã chạy được bao nhiêu cây số',
        kind: 'irrelevant',
        feedback: 'Thành tích lúc này không quan trọng. Anh Khoa cần được nghỉ và làm mát.',
      },
      {
        id: 'call',
        text: 'Gọi người gần đó đến giúp; sẵn sàng gọi 115 nếu anh Khoa lơ mơ hoặc không đỡ',
        kind: 'correct',
        mandatory: true,
        feedback: 'Có thêm người giúp và sẵn sàng gọi cấp cứu là việc không thể thiếu.',
      },
      {
        id: 'shade-sit',
        text: 'Dìu anh Khoa vào bóng râm ngồi nghỉ',
        kind: 'partial',
        substitutes: 'shade',
        feedback:
          'Vào chỗ mát là đúng, nhưng nằm nghỉ, kê cao chân và nới lỏng quần áo thì tốt hơn.',
      },
      {
        id: 'shade',
        text: 'Dìu anh Khoa vào bóng râm, cho nằm nghỉ, kê cao chân và nới lỏng quần áo',
        kind: 'correct',
        feedback:
          'Ngừng vận động và ra khỏi nắng là việc cần làm sớm nhất để cơ thể thôi nóng thêm.',
      },
      {
        id: 'pill',
        text: 'Đưa thuốc hạ sốt cho anh Khoa uống',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Thuốc hạ sốt không làm hạ thân nhiệt do nắng nóng và có thể gây hại. Đừng tự ý cho người khác uống thuốc.',
      },
    ],
  },

  act: {
    type: 'drag-place',
    instruction:
      'Giúp anh Khoa hạ nhiệt: đưa từng thứ đến đúng chỗ. Có thứ không nên dùng đâu nhé!',
    zones: [
      { id: 'shade', label: 'Bóng râm gốc cây', x: 30, y: 68 },
      { id: 'neck', label: 'Cổ và trán', x: 69, y: 44 },
      { id: 'hand', label: 'Bàn tay', x: 75, y: 67 },
    ],
    items: [
      {
        id: 'towel',
        label: 'Khăn ướt mát',
        zoneId: 'neck',
        wrongNote: 'Khăn ướt đắp lên cổ và trán mới giúp hạ nhiệt nhanh.',
      },
      {
        id: 'coffee',
        label: 'Cà phê đá',
        zoneId: null,
        wrongNote:
          'Cà phê và nước tăng lực không giúp bù nước. Hãy chọn nước lọc hoặc nước bù điện giải.',
      },
      {
        id: 'move',
        label: 'Dìu anh Khoa đi',
        zoneId: 'shade',
        wrongNote: 'Anh Khoa cần ra khỏi nắng: hãy dìu anh ấy vào bóng râm gốc cây.',
      },
      {
        id: 'jacket',
        label: 'Áo khoác dày',
        zoneId: null,
        wrongNote: 'Ủ ấm làm cơ thể nóng thêm. Anh Khoa cần được nới lỏng quần áo và làm mát.',
      },
      {
        id: 'water',
        label: 'Chai nước lọc',
        zoneId: 'hand',
        wrongNote: 'Đưa chai nước vào tay để anh Khoa tự uống từng ngụm nhỏ.',
      },
    ],
  },

  outcomes: {
    success:
      'Nằm nghỉ trong bóng râm một lúc, anh Khoa hết chóng mặt và cười ngượng: “Lần sau anh sẽ chạy lúc sáng sớm.” Bạn đã xử lý rất đúng thứ tự.',
    'partial-success':
      'Anh Khoa dần đỡ mệt sau khi được nghỉ trong bóng râm. Bạn đã giúp được anh ấy, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Một chú bảo vệ công viên chạy đến giúp đưa anh Khoa vào chỗ mát. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Chú bảo vệ công viên kịp ngăn lại và đưa anh Khoa vào chỗ mát. Những cách làm vừa rồi có thể khiến anh ấy nguy hiểm hơn.',
    timeout:
      'Hết giờ! Chú bảo vệ công viên đã đến đưa anh Khoa vào bóng râm. Lần sau hãy quyết định nhanh hơn một chút nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra.',
    observe: 'Chạm vào các điểm sáng trên hình. Cần xem ít nhất 3 manh mối trước khi kết luận.',
    assess:
      'Chạy lâu dưới nắng gắt, vã mồ hôi, da tái, chóng mặt, chuột rút nhưng vẫn tỉnh: hãy chọn “Nghi ngờ anh Khoa bị kiệt sức vì nóng”.',
    choose:
      'Thứ tự đúng: kiểm tra an toàn trên đường chạy → dìu vào bóng râm, nằm nghỉ, kê cao chân → gọi người giúp, sẵn sàng gọi 115 → đắp khăn ướt, quạt và cho uống từng ngụm nhỏ.',
    act: 'Dìu anh Khoa vào bóng râm gốc cây, đặt khăn ướt lên cổ và trán, đưa chai nước lọc vào tay. Để yên cà phê đá và áo khoác dày.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-park-01',
    title: 'Kiệt sức vì nóng và say nắng',
    levelId: 'park-01',
    areaId: 'park',
    signs: [
      'Vã nhiều mồ hôi, da tái, mát và ẩm',
      'Chóng mặt, đau đầu, buồn nôn, rất khát',
      'Chuột rút ở tay, chân hoặc bụng',
      'Mệt lả nhưng vẫn tỉnh táo và trả lời được',
    ],
    principles: [
      'Kiểm tra an toàn xung quanh, rồi cho nạn nhân ngừng vận động ngay',
      'Đưa vào nơi râm mát, cho nằm nghỉ, kê cao chân và nới lỏng quần áo',
      'Làm mát bằng khăn ướt, xịt nước mát và quạt',
      'Nếu nạn nhân hoàn toàn tỉnh táo, cho uống từng ngụm nhỏ nước lọc hoặc nước bù điện giải',
      'Ở lại theo dõi cho đến khi nạn nhân đỡ hẳn',
    ],
    donts: [
      'Không để nạn nhân cố vận động tiếp',
      'Không cho uống rượu bia, cà phê hay nước tăng lực',
      'Không tự ý cho uống thuốc hạ sốt',
      'Không cho ăn uống khi nạn nhân lơ mơ hoặc nôn nhiều',
    ],
    callForHelp: [
      'Nạn nhân lơ mơ, nói lẫn, ngất hoặc co giật',
      'Da nóng bừng, thân nhiệt rất cao',
      'Không đỡ hơn sau khoảng 30 phút nghỉ ngơi và làm mát',
      'Nôn liên tục, không uống được nước',
      'Trong lúc chờ 115: tiếp tục làm mát tích cực bằng nước mát và quạt',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
