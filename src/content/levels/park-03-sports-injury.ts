import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. The first-aid guidance has not been checked by a qualified
 * reviewer (see lesson.reviewer).
 */
const level: LevelDef = {
  id: 'park-03',
  areaId: 'park',
  title: 'Buổi dã ngoại cuối tuần',
  scene: 'Bãi cỏ công viên',
  timeLimitSec: 150,

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Cuối tuần cả nhóm rủ nhau ra công viên đánh cầu lông. Vui ghê!',
      mood: 'happy',
    },
    { text: 'Linh lùi lại đón quả cầu, trượt chân trên cỏ ướt và chống tay xuống đất.' },
    {
      speaker: 'Linh',
      text: 'Á… tay tớ! Đau quá, tớ không dám nhúc nhích nữa…',
      mood: 'pain',
    },
    {
      speaker: GUIDE_NAME,
      text: 'Khoan đỡ Linh dậy đã. Mình quan sát thật kỹ cánh tay bạn ấy trước nhé!',
      mood: 'worried',
    },
  ],

  observe: {
    required: 3,
    clues: [
      {
        id: 'arm',
        label: 'Cẳng tay',
        caption:
          'Cẳng tay phải của Linh sưng lên nhanh và bắt đầu bầm tím. Da vẫn lành, không có vết thương hở.',
        x: 55,
        y: 60,
      },
      {
        id: 'posture',
        label: 'Tư thế',
        caption: 'Linh dùng tay trái ôm chặt tay phải vào người và không chịu cử động nó.',
        x: 50,
        y: 79,
      },
      {
        id: 'fingers',
        label: 'Ngón tay',
        caption: 'Các ngón tay của Linh vẫn hồng, ấm, còn cảm giác và nhúc nhích nhẹ được.',
        x: 40,
        y: 65,
      },
      {
        id: 'face',
        label: 'Gương mặt',
        caption: 'Linh nhăn mặt vì đau nhưng vẫn tỉnh táo. Bạn ấy nói mình không bị đập đầu.',
        x: 47,
        y: 42,
      },
      {
        id: 'grass',
        label: 'Bãi cỏ',
        caption: 'Cỏ còn ướt sau cơn mưa sáng nên rất trơn. Vợt và cầu rơi ngay cạnh chỗ Linh ngã.',
        x: 20,
        y: 82,
      },
    ],
  },

  assess: {
    question: 'Chuyện gì đang xảy ra với Linh?',
    options: [
      {
        id: 'cramp',
        text: 'Linh chỉ bị chuột rút',
        correct: false,
        feedback: 'Chuột rút không gây sưng bầm sau một cú ngã chống tay.',
      },
      {
        id: 'fracture',
        text: 'Nghi ngờ Linh bị gãy xương cẳng tay',
        correct: true,
        feedback:
          'Đúng rồi: ngã chống tay, đau nhiều, sưng bầm nhanh và không dám cử động là các dấu hiệu gợi ý gãy xương. Chỉ bác sĩ mới khẳng định được.',
      },
      {
        id: 'scrape',
        text: 'Linh chỉ bị trầy xước ngoài da',
        correct: false,
        feedback: 'Da tay Linh vẫn lành; chỗ đau và sưng nằm sâu bên trong.',
      },
      {
        id: 'heat',
        text: 'Nghi ngờ Linh sắp ngất vì nắng nóng',
        correct: false,
        feedback: 'Linh tỉnh táo và kêu đau ở tay ngay sau cú ngã; trời lại đang mát sau mưa.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì? Chọn các việc theo đúng thứ tự.',
    order: ['safe', 'still', 'call', 'cold'],
    options: [
      {
        id: 'cold',
        text: 'Chườm nhẹ túi đá bọc khăn lên chỗ sưng và ở bên trấn an Linh',
        kind: 'correct',
        feedback: 'Chườm lạnh giúp giảm sưng đau; có người ở bên giúp Linh bớt sợ.',
      },
      {
        id: 'straighten',
        text: 'Nắm tay Linh kéo cho thẳng lại',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Nắn kéo có thể làm xương lệch thêm, tổn thương mạch máu và dây thần kinh.',
      },
      {
        id: 'call',
        text: 'Báo người lớn và gọi 115, hoặc nhờ đưa Linh đến bệnh viện',
        kind: 'correct',
        mandatory: true,
        feedback: 'Nghi ngờ gãy xương thì cần được bác sĩ khám và chụp phim càng sớm càng tốt.',
      },
      {
        id: 'sub',
        text: 'Nhặt cầu, tìm người đánh thay cho đủ đội',
        kind: 'irrelevant',
        feedback: 'Trận cầu để sau cũng được. Lúc này Linh cần được giúp đỡ.',
      },
      {
        id: 'safe',
        text: 'Dừng trận cầu, dẹp vợt và nhắc mọi người tránh chỗ cỏ trơn',
        kind: 'correct',
        mandatory: true,
        feedback: 'Dọn chỗ an toàn trước để không ai trượt ngã thêm hay va vào Linh.',
      },
      {
        id: 'self-hold',
        text: 'Bảo Linh ngồi yên, tự ôm tay chờ người đến',
        kind: 'partial',
        substitutes: 'still',
        feedback:
          'Giữ yên là đúng, nhưng có người đỡ và có dây treo tay thì Linh đỡ đau và vững hơn.',
      },
      {
        id: 'still',
        text: 'Giữ nguyên tay Linh ở tư thế bạn ấy đang giữ, đỡ bằng áo khoác gấp làm dây treo',
        kind: 'correct',
        feedback: 'Giữ bất động ở tư thế đỡ đau nhất giúp chỗ gãy không bị xê dịch.',
      },
      {
        id: 'oil',
        text: 'Xoa dầu nóng và bóp mạnh chỗ sưng',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Xoa bóp và dầu nóng làm sưng đau nặng hơn và có thể làm xương lệch thêm.',
      },
    ],
  },

  act: {
    type: 'sequence',
    steps: [
      {
        type: 'quick-decision',
        instruction: 'Trong lúc chờ người lớn đến: việc nào nên làm, việc nào không?',
        answers: ['Nên làm', 'Không nên'],
        secPerCard: 8,
        cards: [
          {
            id: 'keep',
            text: 'Giữ nguyên cánh tay ở tư thế Linh đang giữ',
            answer: 0,
            why: 'Tư thế Linh tự chọn thường là tư thế đỡ đau và an toàn nhất.',
          },
          {
            id: 'pull',
            text: 'Kéo thử cho cánh tay thẳng lại',
            answer: 1,
            why: 'Nắn kéo có thể làm xương lệch thêm và tổn thương mạch máu, dây thần kinh.',
          },
          {
            id: 'sling',
            text: 'Đỡ tay bằng áo khoác gấp hoặc khăn làm dây treo',
            answer: 0,
            why: 'Dây treo tạm giúp cánh tay được nâng đỡ và ít bị xê dịch.',
          },
          {
            id: 'eat',
            text: 'Cho Linh ăn uống thoải mái trước khi đến bệnh viện',
            answer: 1,
            why: 'Linh có thể cần phẫu thuật, nên không ăn uống gì trong lúc chờ.',
          },
          {
            id: 'ice',
            text: 'Chườm túi đá bọc khăn lên chỗ sưng',
            answer: 0,
            why: 'Chườm lạnh qua lớp khăn giúp giảm sưng đau mà không làm bỏng lạnh da.',
          },
          {
            id: 'wiggle',
            text: 'Bảo Linh thử xoay cổ tay xem còn đau không',
            answer: 1,
            why: 'Cử động thử chỉ làm đau thêm và có thể khiến chỗ gãy nặng hơn.',
          },
        ],
      },
      {
        type: 'hold',
        instruction:
          'Đỡ cánh tay Linh thật vững, phía trên và phía dưới chỗ đau, cho đến khi người lớn đến.',
        action: 'Đỡ yên cánh tay',
        holdSec: 6,
        holdingText: 'Giữ thật yên, đừng buông tay…',
        releaseText: 'Tay Linh bị xê dịch và đau hơn. Đỡ lại thật vững nhé!',
        realityNote:
          'Ngoài đời, cần giữ cánh tay bất động suốt cho đến khi nhân viên y tế tiếp nhận, không chỉ vài giây.',
      },
    ],
  },

  outcomes: {
    success:
      'Cô phụ trách đến nơi và đưa Linh đi bệnh viện. Nhờ tay được giữ yên suốt, Linh đỡ đau hẳn. Bác sĩ khen cả nhóm đã không nắn kéo hay xoa bóp.',
    'partial-success':
      'Linh được cô phụ trách đưa đến bệnh viện an toàn. Bạn đã giúp được Linh, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Cô phụ trách đến kịp, cố định tay và đưa Linh đi bệnh viện. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Cô phụ trách kịp ngăn lại và đưa Linh đi bệnh viện. Những cách làm vừa rồi có thể khiến tay Linh bị thương nặng hơn.',
    timeout:
      'Hết giờ! Cô phụ trách đã đến đưa Linh đi bệnh viện. Lần sau hãy quyết định nhanh hơn một chút nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra.',
    observe: 'Chạm vào các điểm sáng trên hình. Cần xem ít nhất 3 manh mối trước khi kết luận.',
    assess:
      'Ngã chống tay, đau nhiều, sưng bầm nhanh và không dám cử động: hãy chọn “Nghi ngờ Linh bị gãy xương cẳng tay”.',
    choose:
      'Thứ tự đúng: dừng trận cầu, dọn chỗ an toàn → giữ nguyên tay, đỡ bằng dây treo → báo người lớn, gọi 115 hoặc đến bệnh viện → chườm đá bọc khăn và trấn an.',
    act: 'Nên làm: giữ nguyên tay, đỡ bằng áo khoác hoặc khăn, chườm đá bọc khăn. Không nên: kéo thẳng tay, cho ăn uống, bảo thử xoay cổ tay. Sau đó nhấn giữ nút để đỡ tay Linh, đừng buông giữa chừng.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-park-03',
    title: 'Nghi ngờ gãy xương khi chơi thể thao',
    levelId: 'park-03',
    areaId: 'park',
    signs: [
      'Đau nhiều sau khi ngã hoặc va đập, đau tăng khi cử động',
      'Sưng nhanh, bầm tím, có thể biến dạng',
      'Không dám hoặc không thể cử động phần bị thương',
    ],
    principles: [
      'Dừng cuộc chơi và kiểm tra an toàn xung quanh',
      'Không di chuyển phần bị thương; giữ nguyên tư thế nạn nhân thấy đỡ đau nhất',
      'Đỡ phía trên và phía dưới chỗ đau; có thể dùng áo khoác hoặc khăn làm dây treo tay',
      'Chườm túi đá bọc khăn để giảm sưng đau',
      'Gọi 115 hoặc đưa nạn nhân đến cơ sở y tế',
    ],
    donts: [
      'Không nắn, kéo hay cố làm thẳng chỗ nghi gãy',
      'Không xoa dầu nóng, bóp hay đắp lá lên chỗ sưng',
      'Không bảo nạn nhân thử cử động xem còn đau không',
      'Không cho ăn uống trong lúc chờ, vì nạn nhân có thể cần phẫu thuật',
    ],
    callForHelp: [
      'Có vết thương hở hoặc nhìn thấy đầu xương',
      'Bàn tay, ngón tay lạnh, tím tái, tê hoặc mất cảm giác',
      'Tay chân biến dạng rõ',
      'Nạn nhân choáng, vã mồ hôi lạnh hoặc lơ mơ',
      'Nghi ngờ chấn thương ở đầu, cổ, lưng hoặc đùi',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
