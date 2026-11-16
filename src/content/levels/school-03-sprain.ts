import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. The first-aid guidance has not been checked by a qualified
 * reviewer (see lesson.reviewer).
 */
const level: LevelDef = {
  id: 'school-03',
  areaId: 'school',
  title: 'Trận bóng chiều thứ sáu',
  scene: 'Sân bóng',

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Chiều thứ sáu, sân trường rộn ràng trận bóng giữa hai lớp!',
      mood: 'happy',
    },
    {
      text: 'Huy bật cao tranh bóng. Lúc tiếp đất, bàn chân cậu ấy lật sang một bên. Huy ngồi thụp xuống, ôm lấy cổ chân.',
    },
    {
      speaker: 'Huy',
      text: 'Ui da… cổ chân tớ đau quá. Để tớ đứng dậy đá tiếp, sắp hết giờ rồi…',
      mood: 'pain',
    },
    {
      speaker: GUIDE_NAME,
      text: 'Từ từ đã Huy ơi. Mình xem kỹ cổ chân trước đã nhé!',
      mood: 'worried',
    },
  ],

  observe: {
    clues: [
      {
        id: 'ankle',
        label: 'Cổ chân',
        caption: 'Cổ chân phải của Huy bắt đầu sưng lên, chạm nhẹ vào là đau.',
        x: 63,
        y: 66,
        essential: true,
      },
      {
        id: 'foot',
        label: 'Bàn chân',
        caption:
          'Bàn chân và cổ chân không lệch hay biến dạng. Huy vẫn cử động được các ngón chân.',
        x: 81,
        y: 73,
        essential: true,
      },
      {
        id: 'face',
        label: 'Gương mặt',
        caption: 'Huy nhăn mặt vì đau nhưng vẫn tỉnh táo, nói chuyện bình thường.',
        x: 50,
        y: 36,
        essential: true,
      },
      {
        id: 'field',
        label: 'Sân bóng',
        caption: 'Trận đấu vẫn tiếp tục. Bóng và các bạn đang chạy ngay gần chỗ Huy ngồi.',
        x: 18,
        y: 36,
        essential: false,
      },
      {
        id: 'kit',
        label: 'Túi y tế của lớp',
        caption: 'Bên đường biên có túi y tế của lớp: túi chườm lạnh, khăn và băng thun.',
        x: 19,
        y: 80,
        essential: false,
      },
    ],
  },

  assess: {
    question: 'Chuyện gì đang xảy ra với Huy?',
    options: [
      {
        id: 'cramp',
        text: 'Nghi ngờ Huy bị chuột rút',
        correct: false,
        feedback:
          'Chuột rút là cơ co cứng, thường ở bắp chân. Huy lại đau và sưng ở khớp cổ chân sau khi lật chân.',
      },
      {
        id: 'tired',
        text: 'Huy chỉ mệt, nghỉ một phút là đá tiếp được',
        correct: false,
        feedback: 'Cổ chân Huy đang sưng và đau. Đá tiếp có thể làm chấn thương nặng hơn.',
      },
      {
        id: 'sprain',
        text: 'Nghi ngờ Huy bị bong gân cổ chân',
        correct: true,
        feedback:
          'Đúng rồi: lật cổ chân khi tiếp đất, đau và sưng nhưng không biến dạng là các dấu hiệu gợi ý bong gân.',
      },
      {
        id: 'heat',
        text: 'Nghi ngờ Huy bị say nắng',
        correct: false,
        feedback: 'Huy tỉnh táo, không chóng mặt hay nóng bừng. Chỗ đau nằm ở cổ chân.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì? Chọn các việc theo đúng thứ tự.',
    order: ['safe', 'rest', 'call', 'cold'],
    options: [
      {
        id: 'cold',
        text: 'Chườm túi lạnh bọc trong khăn lên cổ chân, rồi kê chân cao',
        kind: 'correct',
        feedback: 'Chườm lạnh và kê cao chân giúp giảm sưng, giảm đau.',
      },
      {
        id: 'oil',
        text: 'Xoa dầu nóng và nắn bóp mạnh cổ chân',
        kind: 'unsafe',
        feedback: 'Không an toàn! Dầu nóng và xoa bóp sớm làm cổ chân sưng và đau nhiều hơn.',
      },
      {
        id: 'safe',
        text: 'Ra hiệu tạm dừng trận đấu để không ai va vào Huy',
        kind: 'correct',
        mandatory: true,
        feedback: 'Luôn bảo đảm xung quanh an toàn trước khi chăm sóc người bị thương.',
      },
      {
        id: 'argue',
        text: 'Tranh luận với trọng tài xem có ai phạm lỗi không',
        kind: 'irrelevant',
        feedback: 'Việc này không giúp gì cho Huy lúc này.',
      },
      {
        id: 'rest',
        text: 'Để Huy ngồi yên, không đứng lên hay bước đi bằng chân đau',
        kind: 'correct',
        feedback: 'Cho cổ chân nghỉ ngay giúp chấn thương không nặng thêm.',
      },
      {
        id: 'walk',
        text: 'Dìu Huy đứng dậy chạy thử vài bước xem sao',
        kind: 'unsafe',
        feedback: 'Không an toàn! Dồn sức lên chân đang đau có thể làm chấn thương nặng thêm.',
      },
      {
        id: 'call',
        text: 'Nhờ bạn báo thầy thể dục và phòng y tế đến kiểm tra cho Huy',
        kind: 'correct',
        mandatory: true,
        feedback: 'Người có chuyên môn cần xem cổ chân để chắc rằng không phải gãy xương.',
      },
    ],
  },

  act: {
    type: 'sequence',
    steps: [
      {
        type: 'drag-place',
        instruction:
          'Chăm sóc cổ chân cho Huy: đưa từng món đồ đến đúng chỗ. Món không nên dùng thì để yên.',
        zones: [
          { id: 'ankle', label: 'Cổ chân đau', x: 61, y: 62 },
          { id: 'under', label: 'Dưới bắp chân, để kê chân cao', x: 77, y: 84 },
        ],
        items: [
          {
            id: 'oil',
            label: 'Chai dầu nóng',
            art: 'item-oil-bottle',
            zoneId: null,
            wrongNote: 'Dầu nóng làm cổ chân sưng hơn trong những ngày đầu.',
          },
          {
            id: 'coldpack',
            label: 'Túi chườm lạnh bọc khăn',
            art: 'item-cold-pack',
            zoneId: 'ankle',
            wrongNote: 'Túi chườm lạnh cần đặt lên cổ chân đang đau.',
          },
          {
            id: 'hotpack',
            label: 'Túi chườm nóng',
            art: 'item-hot-pack',
            zoneId: null,
            wrongNote: 'Chườm nóng sớm làm sưng nhiều hơn. Lúc này cần chườm lạnh.',
          },
          {
            id: 'backpack',
            label: 'Ba lô để kê chân',
            art: 'item-backpack',
            zoneId: 'under',
            wrongNote: 'Ba lô dùng để kê dưới bắp chân, nâng chân Huy lên cao.',
          },
        ],
      },
      {
        type: 'hold',
        instruction: 'Giữ túi chườm lạnh áp đều lên cổ chân Huy.',
        action: 'Giữ túi chườm lạnh',
        holdSec: 5,
        tool: { art: 'item-cold-pack', x: 62, y: 64 },
        holdingText: 'Giữ yên tay… Huy thấy dễ chịu hơn rồi.',
        releaseText: 'Túi chườm bị tuột mất rồi. Áp lại và giữ đều tay nhé.',
        realityNote:
          'Ngoài đời, mỗi lần chườm lạnh khoảng 15–20 phút, luôn bọc túi lạnh trong khăn, rồi nghỉ trước khi chườm lại.',
      },
    ],
  },

  outcomes: {
    success:
      'Cổ chân Huy được chườm lạnh và kê cao, đỡ đau hẳn. Thầy thể dục và cô y tế đến kiểm tra, rồi dìu Huy về phòng y tế. Huy cười: “Tuần sau tớ làm cổ động viên vậy!”',
    'partial-success':
      'Huy được cô y tế đưa về phòng y tế nghỉ ngơi. Bạn đã giúp được Huy, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Thầy thể dục đến kịp và chăm sóc cổ chân cho Huy. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Thầy thể dục kịp ngăn lại và gọi cô y tế. Những cách làm vừa rồi có thể khiến cổ chân Huy sưng đau và lâu lành hơn.',
    timeout:
      'Hết giờ! Thầy thể dục đã đến chăm sóc Huy. Lần sau hãy quyết định nhanh hơn một chút nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra.',
    observe:
      'Chạm vào từng dấu “?” trên hình. Khi đã xem hết những điểm quan trọng, bạn mới kết luận được.',
    assess:
      'Huy lật cổ chân khi tiếp đất, cổ chân đau và sưng nhưng không biến dạng: hãy chọn “Nghi ngờ Huy bị bong gân cổ chân”.',
    choose:
      'Thứ tự đúng: tạm dừng trận đấu → để Huy ngồi yên → nhờ báo thầy thể dục và phòng y tế → chườm túi lạnh bọc khăn rồi kê chân cao.',
    act: 'Đưa túi chườm lạnh bọc khăn vào “Cổ chân đau” và ba lô vào “Dưới bắp chân”; dầu nóng và túi chườm nóng thì để yên. Sau đó nhấn giữ nút cho đến khi thanh đầy, đừng thả tay giữa chừng.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-school-03',
    title: 'Bong gân',
    levelId: 'school-03',
    areaId: 'school',
    signs: [
      'Đau ở khớp ngay sau khi lật, vặn hoặc tiếp đất sai tư thế',
      'Sưng, có thể bầm tím quanh khớp',
      'Đau tăng khi cử động hoặc khi dồn sức lên chỗ bị thương',
    ],
    principles: [
      'Dừng chơi ngay và để phần bị thương được nghỉ',
      'Chườm lạnh mỗi lần khoảng 15–20 phút, luôn bọc túi lạnh trong khăn',
      'Đỡ và kê cao phần bị thương ở tư thế thoải mái',
      'Có thể quấn băng thun vừa phải để đỡ khớp, không quấn quá chặt',
      'Báo cho thầy cô hoặc nhân viên y tế để được kiểm tra',
      'Nếu không chắc là bong gân hay gãy xương, hãy giữ yên và xử trí như gãy xương',
    ],
    donts: [
      'Không xoa dầu nóng, chườm nóng hay nắn bóp trong những ngày đầu',
      'Không cố đi lại, chạy nhảy trên chân đang đau',
      'Không áp đá lạnh trực tiếp lên da',
      'Không mải tranh cãi ai đúng ai sai khi bạn mình đang đau',
    ],
    callForHelp: [
      'Khớp hoặc xương trông biến dạng, lệch khác thường',
      'Không thể đứng hay bước đi bằng chân đau',
      'Bàn chân, ngón chân bị tê, lạnh hoặc tím tái',
      'Đau dữ dội, sưng rất nhanh, hoặc không đỡ sau vài ngày',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
