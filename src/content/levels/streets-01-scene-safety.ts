import { GUIDE_NAME } from '@/content/areas'
import type { LevelDef } from '@/game/types'

/**
 * DRAFT content. The first-aid guidance has not been checked by a qualified
 * reviewer (see lesson.reviewer).
 */
const level: LevelDef = {
  id: 'streets-01',
  areaId: 'streets',
  title: 'Ngã tư giờ tan tầm',
  scene: 'Ngã tư',
  timeLimitSec: 135,

  intro: [
    {
      speaker: GUIDE_NAME,
      text: 'Giờ tan tầm, ngã tư đông xe quá. Mình đứng trên vỉa hè chờ đèn nhé!',
      mood: 'neutral',
    },
    { text: 'Két! Một chiếc xe máy trượt bánh trên vệt nước rồi đổ nghiêng giữa ngã tư.' },
    {
      speaker: 'Anh Hải',
      text: 'Ui da… chân anh đau quá, không đứng lên được.',
      mood: 'pain',
    },
    {
      speaker: GUIDE_NAME,
      text: 'Khoan chạy ra đã! Xe cộ vẫn đang qua lại. Quan sát thật kỹ trước nhé!',
      mood: 'surprised',
    },
  ],

  observe: {
    required: 3,
    clues: [
      {
        id: 'rider',
        label: 'Người lái xe',
        caption: 'Anh Hải ngồi trên mặt đường, tỉnh táo, nói chuyện rõ. Anh vẫn đội mũ bảo hiểm.',
        x: 50,
        y: 51,
      },
      {
        id: 'leg',
        label: 'Chân phải',
        caption: 'Anh ôm chân phải, nhăn mặt mỗi khi cử động. Không thấy chảy máu nhiều.',
        x: 43,
        y: 69,
      },
      {
        id: 'bike',
        label: 'Chiếc xe máy',
        caption: 'Xe đổ nghiêng nhưng vẫn nổ máy, bánh sau còn quay. Xăng đang rỉ ra mặt đường.',
        x: 78,
        y: 57,
      },
      {
        id: 'traffic',
        label: 'Dòng xe',
        caption: 'Xe máy, ô tô vẫn chạy sát chỗ anh Hải ngồi. Nhiều người chưa kịp nhìn thấy anh.',
        x: 25,
        y: 30,
      },
      {
        id: 'road',
        label: 'Mặt đường',
        caption: 'Mảnh gương xe vỡ văng khắp nơi, mặt đường ướt và trơn.',
        x: 40,
        y: 88,
      },
    ],
  },

  assess: {
    question: 'Tình huống ở ngã tư đang như thế nào?',
    options: [
      {
        id: 'just-fell',
        text: 'Chỉ là ngã nhẹ, anh Hải tự đứng dậy đi tiếp được',
        correct: false,
        feedback: 'Anh Hải đau đến mức không đứng lên được. Chân anh có thể đã bị thương.',
      },
      {
        id: 'unsafe-scene',
        text: 'Nghi ngờ anh Hải bị thương ở chân, và hiện trường còn nguy hiểm',
        correct: true,
        feedback:
          'Đúng rồi: anh Hải tỉnh nhưng đau chân, còn xe cộ, xăng rỉ và kính vỡ khiến nơi này chưa an toàn.',
      },
      {
        id: 'fainted',
        text: 'Nghi ngờ anh Hải bị ngất xỉu',
        correct: false,
        feedback: 'Anh Hải vẫn tỉnh táo và nói chuyện rõ ràng.',
      },
      {
        id: 'not-breathing',
        text: 'Nghi ngờ anh Hải ngừng thở, cần ép tim ngay',
        correct: false,
        feedback: 'Người đang nói chuyện được thì vẫn đang thở. Không ép tim cho người còn tỉnh.',
      },
    ],
  },

  choose: {
    prompt: 'Bạn sẽ làm gì? Chọn các việc theo đúng thứ tự.',
    order: ['safe', 'warn', 'call', 'stay'],
    options: [
      {
        id: 'call',
        text: 'Gọi 115, nói rõ ngã tư nào và anh Hải đang thế nào',
        kind: 'correct',
        mandatory: true,
        feedback: 'Nói rõ địa điểm và tình trạng giúp xe cấp cứu đến đúng nơi, nhanh hơn.',
      },
      {
        id: 'pull-leg',
        text: 'Nắn và kéo thử chân anh Hải xem có gãy không',
        kind: 'unsafe',
        feedback: 'Không an toàn! Nắn kéo chân đang đau có thể làm tổn thương nặng thêm.',
      },
      {
        id: 'safe',
        text: 'Dừng lại quan sát xe cộ, chỉ lại gần khi đường đã an toàn',
        kind: 'correct',
        mandatory: true,
        feedback: 'An toàn của bạn là trên hết. Người cứu không được trở thành nạn nhân thứ hai.',
      },
      {
        id: 'photo',
        text: 'Chụp ảnh hiện trường đăng lên mạng',
        kind: 'irrelevant',
        feedback: 'Việc này không giúp gì cho anh Hải, và không tôn trọng người gặp nạn.',
      },
      {
        id: 'stay',
        text: 'Bảo anh Hải ngồi yên, giữ nguyên chân đau, ở cạnh trấn an anh',
        kind: 'correct',
        feedback: 'Giữ yên chỗ đau và có người ở bên giúp anh Hải bớt đau, bớt sợ.',
      },
      {
        id: 'engine-only',
        text: 'Tắt máy chiếc xe bị đổ',
        kind: 'partial',
        substitutes: 'warn',
        feedback:
          'Tắt máy là đúng, nhưng còn cần người ra hiệu để xe khác nhìn thấy và đi chậm lại.',
      },
      {
        id: 'rush',
        text: 'Chạy thẳng ra giữa đường, đỡ anh Hải đứng dậy ngay',
        kind: 'unsafe',
        feedback:
          'Không an toàn! Lao ra khi xe còn chạy rất dễ bị đâm, và đỡ dậy có thể làm chân anh Hải nặng thêm.',
      },
      {
        id: 'warn',
        text: 'Nhờ người đứng ở chỗ an toàn ra hiệu cho xe đi chậm, rồi tắt máy xe bị đổ',
        kind: 'correct',
        feedback:
          'Làm cho mọi người nhìn thấy hiện trường và tắt máy xe giúp tránh tai nạn thứ hai.',
      },
    ],
  },

  act: {
    type: 'sequence',
    steps: [
      {
        type: 'scan',
        instruction: 'Tìm hết những mối nguy quanh anh Hải. Chỗ nào an toàn thì đừng chạm.',
        spots: [
          {
            id: 'lane',
            label: 'Làn xe đang chạy',
            x: 26,
            y: 30,
            hazard: true,
            note: 'Nguy hiểm: xe vẫn lao tới, cần có người ra hiệu từ xa.',
          },
          {
            id: 'engine',
            label: 'Xe còn nổ máy',
            x: 78,
            y: 52,
            hazard: true,
            note: 'Nguy hiểm: bánh xe còn quay và máy nóng, cần tắt máy.',
          },
          {
            id: 'fuel',
            label: 'Vệt xăng loang',
            x: 74,
            y: 78,
            hazard: true,
            note: 'Nguy hiểm: xăng dễ bắt lửa và rất trơn. Không ai được hút thuốc gần đây.',
          },
          {
            id: 'glass',
            label: 'Mảnh kính vỡ',
            x: 42,
            y: 89,
            hazard: true,
            note: 'Nguy hiểm: kính vỡ có thể cắt vào tay chân khi quỳ xuống giúp.',
          },
          {
            id: 'pavement',
            label: 'Vỉa hè',
            x: 12,
            y: 76,
            hazard: false,
            note: 'Vỉa hè là chỗ đứng an toàn để quan sát và gọi trợ giúp.',
          },
          {
            id: 'bicycle',
            label: 'Xe đạp bên lề',
            x: 17,
            y: 54,
            hazard: false,
            note: 'Chiếc xe đạp dựng gọn trên lề, không gây nguy hiểm gì.',
          },
        ],
      },
      {
        type: 'quick-decision',
        instruction: 'Mọi người xúm lại, mỗi người một ý. Việc nào nên làm, việc nào không?',
        answers: ['Nên làm', 'Không nên'],
        secPerCard: 9,
        cards: [
          {
            id: 'wave',
            text: 'Đứng ở chỗ an toàn, vẫy tay ra hiệu cho xe đi chậm lại',
            answer: 0,
            why: 'Báo hiệu từ xa giúp các xe khác kịp nhìn thấy và tránh.',
          },
          {
            id: 'stand-up',
            text: 'Xốc nách kéo anh Hải đứng dậy',
            answer: 1,
            why: 'Không di chuyển người bị thương khi chưa có nguy hiểm ngay trước mắt.',
          },
          {
            id: 'helmet',
            text: 'Tháo mũ bảo hiểm cho anh Hải dễ thở',
            answer: 1,
            why: 'Anh Hải đang tỉnh và thở tốt. Tháo mũ sai cách có thể làm tổn thương cổ.',
          },
          {
            id: 'call-115',
            text: 'Gọi 115, nói rõ tên ngã tư và tình trạng anh Hải',
            answer: 0,
            why: 'Thông tin rõ ràng giúp xe cấp cứu tìm đến nhanh.',
          },
          {
            id: 'crowd',
            text: 'Kéo nhau ra đứng vây kín quanh anh Hải',
            answer: 1,
            why: 'Đứng đông giữa đường rất nguy hiểm và làm anh Hải thêm hoảng.',
          },
          {
            id: 'keep-still',
            text: 'Bảo anh Hải ngồi yên, không cử động chân đau',
            answer: 0,
            why: 'Giữ yên giúp chỗ bị thương không nặng thêm trong lúc chờ cấp cứu.',
          },
        ],
      },
    ],
  },

  outcomes: {
    success:
      'Xe cộ đi chậm lại và vòng qua. Xe cấp cứu đến đúng ngã tư, anh Hải được cố định chân rồi đưa đi. Bạn đã giữ an toàn cho cả anh và chính mình.',
    'partial-success':
      'Xe cấp cứu đã đến và đưa anh Hải đi. Bạn đã giúp được anh, dù vẫn còn vài chỗ có thể làm tốt hơn.',
    'recoverable-mistake':
      'Chú cảnh sát giao thông đến kịp, phân luồng xe và gọi cấp cứu. Lần này bạn đã bỏ sót một bước quan trọng. Xem lại và thử lần nữa nhé.',
    'unsafe-failure':
      'Chú cảnh sát giao thông kịp ngăn lại và gọi cấp cứu. Những cách làm vừa rồi có thể khiến bạn và anh Hải gặp nguy hiểm hơn.',
    timeout:
      'Hết giờ! Chú cảnh sát giao thông đã đến phân luồng xe và gọi cấp cứu cho anh Hải. Lần sau hãy quyết định nhanh hơn một chút nhé.',
  },

  hints: {
    intro: 'Đọc hết đoạn hội thoại để biết chuyện gì vừa xảy ra ở ngã tư.',
    observe: 'Chạm vào các điểm sáng trên hình. Cần xem ít nhất 3 manh mối trước khi kết luận.',
    assess:
      'Anh Hải tỉnh, đau chân, còn xung quanh thì xe chạy, xăng rỉ, kính vỡ: hãy chọn “Nghi ngờ anh Hải bị thương ở chân, và hiện trường còn nguy hiểm”.',
    choose:
      'Thứ tự đúng: dừng lại quan sát xe cộ → nhờ người ra hiệu và tắt máy xe → gọi 115 → bảo anh Hải ngồi yên và ở cạnh trấn an.',
    act: 'Phần tìm mối nguy: chạm vào làn xe đang chạy, xe còn nổ máy, vệt xăng và mảnh kính; đừng chạm vỉa hè và xe đạp. Phần thẻ: nên ra hiệu cho xe, gọi 115, bảo anh Hải ngồi yên; không nên kéo anh dậy, tháo mũ hay vây quanh.',
    outcome: 'Bấm “Xem kết quả” để biết điểm và lời giải thích.',
  },

  lesson: {
    id: 'lesson-streets-01',
    title: 'An toàn hiện trường khi có tai nạn giao thông',
    levelId: 'streets-01',
    areaId: 'streets',
    signs: [
      'Xe cộ vẫn đang chạy gần nạn nhân',
      'Xăng dầu rò rỉ, xe còn nổ máy, có khói hoặc mùi khét',
      'Mảnh kính, mảnh kim loại sắc trên mặt đường',
      'Trời tối, mưa hoặc khúc cua khuất tầm nhìn khiến xe khác khó thấy hiện trường',
    ],
    principles: [
      'Dừng lại quan sát trước: chỉ lại gần khi bản thân an toàn',
      'Làm cho hiện trường dễ thấy: nhờ người đứng ở chỗ an toàn ra hiệu cho xe đi chậm',
      'Tắt máy xe bị đổ nếu với tới an toàn; tránh xa vệt xăng dầu',
      'Gọi 115 và nói rõ địa điểm, số người bị nạn, tình trạng; gọi 113 khi cần cảnh sát hỗ trợ',
      'Để nạn nhân ở nguyên tư thế, giữ yên chỗ đau, trấn an và ở bên cho đến khi có người đến',
    ],
    donts: [
      'Không lao ra đường khi xe cộ còn đang chạy',
      'Không di chuyển nạn nhân, trừ khi có nguy hiểm ngay trước mắt như cháy hoặc xe sắp lao tới',
      'Không tháo mũ bảo hiểm khi nạn nhân còn tỉnh và thở bình thường',
      'Không nắn, kéo chỗ nghi bị gãy; không cho nạn nhân ăn uống',
      'Không hút thuốc hay bật lửa gần chỗ xăng rò rỉ',
    ],
    callForHelp: [
      'Nạn nhân bất tỉnh, lơ mơ hoặc thở bất thường',
      'Chảy máu nhiều, hoặc tay chân biến dạng, không cử động được',
      'Nạn nhân đau đầu, đau cổ, đau lưng, tê yếu tay chân sau va chạm',
      'Hiện trường có cháy, rò rỉ xăng dầu hoặc nhiều người bị nạn',
    ],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
}

export default level
