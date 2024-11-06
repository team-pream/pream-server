const CONFIRM = {
  BELOW_ZERO_AMOUNT: '금액은 0보다 커야 합니다.',
  INCORRECT_FAIL_URL_FORMAT: '잘못된 failUrl 입니다.',
  INCORRECT_SUCCESS_URL_FORMAT: '잘못된 successUrl 입니다.',
  INVALID_AMOUNT_CURRENCY: '잘못된 통화 값입니다.',
  INVALID_AMOUNT_VALUE: '결제금액이 올바르지 않습니다.',
  INVALID_CLIENT_KEY: 'ClientKey 형태가 올바르지 않습니다.',
  INVALID_CUSTOMER_KEY:
    '고객키는 영문 대소문자, 숫자, 특수문자 -, _, =, ., @로 2자 이상 50자 이하여야 합니다.',
  INVALID_METHOD_TRANSACTION: '이미 다른 요청을 수행하고 있어요.',
  INVALID_PARAMETERS:
    '필수 파라미터를 누락하거나, 정의되지 않은 파라미터를 추가하거나, 파라미터의 타입이 올바르지 않을 때 발생합니다.',
  NOT_SUPPORTED_METHOD: '지원되지 않는 결제수단입니다.',
  NOT_SUPPORTED_PROMISE:
    'Promise 방식을 지원하지 않습니다. successUrl, failUrl을 사용해주세요.',
  UNKNOWN: '알 수 없는 에러가 발생했습니다.',
  USER_CANCEL: '취소되었습니다.',
  V1_METHOD_NOT_SUPPORTED: '해당 API 는 v1 에서만 제공됩니다.',
  INSECURE_KEY_USAGE:
    'test_gsk, live_gsk로 시작하는 시크릿 키는 클라이언트 코드에 노출되면 안 됩니다. 구매자를 식별하는 customerKey 값을 사용해주세요.',
  INVALID_METADATA: '올바르지 않은 metadata 형식입니다.',
  NOT_SUPPORTED_WIDGET_KEY:
    'API 개별 연동 키의 클라이언트 키로 SDK를 연동해주세요. 결제위젯 연동 키는 지원하지 않습니다.',
  ALREADY_PROCESSED_PAYMENT: '이미 처리된 결제 입니다.',
  PROVIDER_ERROR: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  EXCEED_MAX_CARD_INSTALLMENT_PLAN:
    '설정 가능한 최대 할부 개월 수를 초과했습니다.',
  INVALID_REQUEST: '잘못된 요청입니다.',
  NOT_ALLOWED_POINT_USE:
    '포인트 사용이 불가한 카드로 카드 포인트 결제에 실패했습니다.',
  INVALID_API_KEY: '잘못된 시크릿키 연동 정보 입니다.',
  INVALID_REJECT_CARD: '카드 사용이 거절되었습니다. 카드사 문의가 필요합니다.',
  BELOW_MINIMUM_AMOUNT:
    '신용카드는 결제금액이 100원 이상, 계좌는 200원이상부터 결제가 가능합니다.',
  INVALID_CARD_EXPIRATION: '카드 정보를 다시 확인해주세요. (유효기간)',
  INVALID_STOPPED_CARD: '정지된 카드 입니다.',
  EXCEED_MAX_DAILY_PAYMENT_COUNT: '하루 결제 가능 횟수를 초과했습니다.',
  NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT:
    '할부가 지원되지 않는 카드 또는 가맹점 입니다.',
  INVALID_CARD_INSTALLMENT_PLAN: '할부 개월 정보가 잘못되었습니다.',
  NOT_SUPPORTED_MONTHLY_INSTALLMENT_PLAN: '할부가 지원되지 않는 카드입니다.',
  EXCEED_MAX_PAYMENT_AMOUNT: '하루 결제 가능 금액을 초과했습니다.',
  NOT_FOUND_TERMINAL_ID:
    '단말기번호(Terminal Id)가 없습니다. 토스페이먼츠로 문의 바랍니다.',
  INVALID_AUTHORIZE_AUTH: '유효하지 않은 인증 방식입니다.',
  INVALID_CARD_LOST_OR_STOLEN: '분실 혹은 도난 카드입니다.',
  RESTRICTED_TRANSFER_ACCOUNT:
    '계좌는 등록 후 12시간 뒤부터 결제할 수 있습니다. 관련 정책은 해당 은행으로 문의해주세요.',
  INVALID_CARD_NUMBER: '카드번호를 다시 확인해주세요.',
  INVALID_UNREGISTERED_SUBMALL:
    '등록되지 않은 서브몰입니다. 서브몰이 없는 가맹점이라면 안심클릭이나 ISP 결제가 필요합니다.',
  NOT_REGISTERED_BUSINESS: '등록되지 않은 사업자 번호입니다.',
  EXCEED_MAX_ONE_DAY_WITHDRAW_AMOUNT: '1일 출금 한도를 초과했습니다.',
  EXCEED_MAX_ONE_TIME_WITHDRAW_AMOUNT: '1회 출금 한도를 초과했습니다.',
  CARD_PROCESSING_ERROR: '카드사에서 오류가 발생했습니다.',
  EXCEED_MAX_AMOUNT: '거래금액 한도를 초과했습니다.',
  INVALID_ACCOUNT_INFO_RE_REGISTER:
    '유효하지 않은 계좌입니다. 계좌 재등록 후 시도해주세요.',
  NOT_AVAILABLE_PAYMENT: '결제가 불가능한 시간대입니다',
  UNAPPROVED_ORDER_ID: '아직 승인되지 않은 주문번호입니다.',
  EXCEED_MAX_MONTHLY_PAYMENT_AMOUNT:
    '당월 결제 가능금액인 1,000,000원을 초과 하셨습니다.',
  UNAUTHORIZED_KEY: '인증되지 않은 시크릿 키 혹은 클라이언트 키 입니다.',
  REJECT_ACCOUNT_PAYMENT: '잔액부족으로 결제에 실패했습니다.',
  REJECT_CARD_PAYMENT: '한도초과 혹은 잔액부족으로 결제에 실패했습니다.',
  REJECT_CARD_COMPANY: '결제 승인이 거절되었습니다.',
  FORBIDDEN_REQUEST: '허용되지 않은 요청입니다.',
  REJECT_TOSSPAY_INVALID_ACCOUNT:
    '선택하신 출금 계좌가 출금이체 등록이 되어 있지 않아요. 계좌를 다시 등록해 주세요.',
  EXCEED_MAX_AUTH_COUNT:
    '최대 인증 횟수를 초과했습니다. 카드사로 문의해주세요.',
  EXCEED_MAX_ONE_DAY_AMOUNT: '일일 한도를 초과했습니다.',
  NOT_AVAILABLE_BANK: '은행 서비스 시간이 아닙니다.',
  INVALID_PASSWORD: '결제 비밀번호가 일치하지 않습니다.',
  INCORRECT_BASIC_AUTH_FORMAT:
    "잘못된 요청입니다. ':' 를 포함해 인코딩해주세요.",
  FDS_ERROR:
    '[토스페이먼츠] 위험거래가 감지되어 결제가 제한됩니다. 발송된 문자에 포함된 링크를 통해 본인인증 후 결제가 가능합니다. (고객센터: 1644-8051)',
  NOT_FOUND_PAYMENT: '존재하지 않는 결제 정보 입니다.',
  NOT_FOUND_PAYMENT_SESSION:
    '결제 시간이 만료되어 결제 진행 데이터가 존재하지 않습니다.',
  FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING:
    '결제가 완료되지 않았어요. 다시 시도해주세요.',
  FAILED_INTERNAL_SYSTEM_PROCESSING:
    '내부 시스템 처리 작업이 실패했습니다. 잠시 후 다시 시도해주세요.',
  UNKNOWN_PAYMENT_ERROR:
    '결제에 실패했어요. 같은 문제가 반복된다면 은행이나 카드사로 문의해주세요.',
} as const;

const CHECK = {
  NOT_SUPPORTED_MONTHLY_INSTALLMENT_PLAN_BELOW_AMOUNT:
    '5만원 이하의 결제는 할부가 불가능해서 결제에 실패했습니다.',
  UNAUTHORIZED_KEY: '인증되지 않은 시크릿 키 혹은 클라이언트 키 입니다.',
  FORBIDDEN_CONSECUTIVE_REQUEST:
    '반복적인 요청은 허용되지 않습니다. 잠시 후 다시 시도해주세요.',
  INCORRECT_BASIC_AUTH_FORMAT:
    "잘못된 요청입니다. ':' 를 포함해 인코딩해주세요.",
  NOT_FOUND_PAYMENT: '존재하지 않는 결제 정보 입니다.',
  NOT_FOUND: '존재하지 않는 정보 입니다.',
  FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING:
    '결제가 완료되지 않았어요. 다시 시도해주세요.',
};

const CANCEL = {
  ALREADY_CANCELED_PAYMENT: '이미 취소된 결제 입니다.',
  INVALID_REFUND_ACCOUNT_INFO: '환불 계좌번호와 예금주명이 일치하지 않습니다.',
  EXCEED_CANCEL_AMOUNT_DISCOUNT_AMOUNT:
    '즉시할인금액보다 적은 금액은 부분취소가 불가능합니다.',
  INVALID_REQUEST: '잘못된 요청입니다.',
  INVALID_REFUND_ACCOUNT_NUMBER: '잘못된 환불 계좌번호입니다.',
  INVALID_BANK: '유효하지 않은 은행입니다.',
  NOT_MATCHES_REFUNDABLE_AMOUNT: '잔액 결과가 일치하지 않습니다.',
  PROVIDER_ERROR: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  REFUND_REJECTED: '환불이 거절됐습니다. 결제사에 문의 부탁드립니다.',
  ALREADY_REFUND_PAYMENT: '이미 환불된 결제입니다.',
  FORBIDDEN_BANK_REFUND_REQUEST: '고객 계좌가 입금이 되지 않는 상태입니다.',
  UNAUTHORIZED_KEY: '인증되지 않은 시크릿 키 혹은 클라이언트 키 입니다.',
  NOT_CANCELABLE_AMOUNT: '취소 할 수 없는 금액 입니다.',
  FORBIDDEN_CONSECUTIVE_REQUEST:
    '반복적인 요청은 허용되지 않습니다. 잠시 후 다시 시도해주세요.',
  FORBIDDEN_REQUEST: '허용되지 않은 요청입니다.',
  NOT_CANCELABLE_PAYMENT: '취소 할 수 없는 결제 입니다.',
  EXCEED_MAX_REFUND_DUE: '환불 가능한 기간이 지났습니다.',
  NOT_ALLOWED_PARTIAL_REFUND_WAITING_DEPOSIT:
    '입금 대기중인 결제는 부분 환불이 불가합니다.',
  NOT_ALLOWED_PARTIAL_REFUND:
    '에스크로 주문, 현금 카드 결제일 때는 부분 환불이 불가합니다. 이외 다른 결제 수단에서 부분 취소가 되지 않을 때는 토스페이먼츠에 문의해 주세요.',
  NOT_AVAILABLE_BANK: '은행 서비스 시간이 아닙니다.',
  INCORRECT_BASIC_AUTH_FORMAT:
    "잘못된 요청입니다. ':' 를 포함해 인코딩해주세요.",
  NOT_CANCELABLE_PAYMENT_FOR_DORMANT_USER:
    '휴면 처리된 회원의 결제는 취소할 수 없습니다.',
  NOT_FOUND_PAYMENT: '존재하지 않는 결제 정보 입니다.',
  FAILED_INTERNAL_SYSTEM_PROCESSING:
    '내부 시스템 처리 작업이 실패했습니다. 잠시 후 다시 시도해주세요.',
  FAILED_REFUND_PROCESS:
    '은행 응답시간 지연이나 일시적인 오류로 환불요청에 실패했습니다.',
  FAILED_METHOD_HANDLING_CANCEL:
    '취소 중 결제 시 사용한 결제 수단 처리과정에서 일시적인 오류가 발생했습니다.',
  FAILED_PARTIAL_REFUND:
    '은행 점검, 해약 계좌 등의 사유로 부분 환불이 실패했습니다.',
  COMMON_ERROR: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING:
    '결제가 완료되지 않았어요. 다시 시도해주세요.',
} as const;

const CARD = {
  INVALID_CARD_EXPIRATION: '카드 정보를 다시 확인해주세요. (유효기간)',
  INVALID_CARD_NUMBER: '카드번호를 다시 확인해주세요.',
  INVALID_CARD_PASSWORD: '카드 정보를 다시 확인해주세요. (비밀번호)',
  INVALID_CARD_IDENTITY:
    '입력하신 주민번호/사업자번호가 카드 소유주 정보와 일치하지 않습니다.',
  INVALID_STOPPED_CARD: '정지된 카드 입니다.',
  INVALID_REJECT_CARD: '카드 사용이 거절되었습니다. 카드사 문의가 필요합니다.',
  INVALID_BIRTH_DAY_FORMAT:
    '생년월일 정보는 6자리의 `yyMMdd` 형식이어야 합니다. 사업자등록번호는 10자리의 숫자여야 합니다.',
  NOT_SUPPORTED_CARD_TYPE: '지원되지 않는 카드 종류입니다.',
  NOT_REGISTERED_CARD_COMPANY: '카드를 사용 등록 후 이용해주세요.',
  INVALID_REQUEST: '잘못된 요청입니다.',
  NOT_SUPPORTED_MONTHLY_INSTALLMENT_PLAN: '할부가 지원되지 않는 카드입니다.',
  INVALID_CARD_INSTALLMENT_PLAN: '할부 개월 정보가 잘못되었습니다.',
  NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT:
    '할부가 지원되지 않는 카드 또는 가맹점 입니다.',
  INVALID_EMAIL: '유효하지 않은 이메일 주소 형식입니다.',
  BELOW_MINIMUM_AMOUNT:
    '신용카드는 결제금액이 100원 이상, 계좌는 200원이상부터 결제가 가능합니다.',
  DUPLICATED_ORDER_ID:
    '이미 승인 및 취소가 진행된 중복된 주문번호 입니다. 다른 주문번호로 진행해주세요.',
  INVALID_ORDER_ID:
    '`orderId`는 영문 대소문자, 숫자, 특수문자(-, _) 만 허용합니다. 6자 이상 64자 이하여야 합니다.',
  NOT_ALLOWED_POINT_USE:
    '포인트 사용이 불가한 카드로 카드 포인트 결제에 실패했습니다.',
  INVALID_REQUIRED_PARAM: '필수 파라미터가 누락되었습니다.',
  NOT_SUPPORTED_MONTHLY_INSTALLMENT_PLAN_BELOW_AMOUNT:
    '5만원 이하의 결제는 할부가 불가능해서 결제에 실패했습니다.',
  UNAUTHORIZED_KEY: '인증되지 않은 시크릿 키 혹은 클라이언트 키 입니다.',
  REJECT_CARD_PAYMENT: '한도초과 혹은 잔액부족으로 결제에 실패했습니다.',
  EXCEED_MAX_AUTH_COUNT:
    '최대 인증 횟수를 초과했습니다. 카드사로 문의해주세요.',
  REJECT_ACCOUNT_PAYMENT: '잔액부족으로 결제에 실패했습니다.',
  REJECT_CARD_COMPANY: '결제 승인이 거절되었습니다.',
  INCORRECT_BASIC_AUTH_FORMAT:
    "잘못된 요청입니다. ':' 를 포함해 인코딩해주세요.",
  FAILED_INTERNAL_SYSTEM_PROCESSING:
    '내부 시스템 처리 작업이 실패했습니다. 잠시 후 다시 시도해주세요.',
  FAILED_DB_PROCESSING: '잘못된 요청 값으로 처리 중 DB 에러가 발생했습니다.',
  FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING:
    '결제가 완료되지 않았어요. 다시 시도해주세요.',
  FAILED_CARD_COMPANY_RESPONSE:
    '카드사에서 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.',
} as const;

const TRANSFER = {
  DUPLICATED_ORDER_ID:
    '이미 승인 및 취소가 진행된 중복된 주문번호 입니다. 다른 주문번호로 진행해주세요.',
  INVALID_REQUEST: '잘못된 요청입니다.',
  INVALID_REGISTRATION_NUMBER_TYPE: '유효하지 않은 등록 번호 타입입니다.',
  INVALID_DATE: '날짜 데이터가 잘못 되었습니다.',
  INVALID_BANK: '유효하지 않은 은행입니다.',
  EXCEED_MAX_DUE_DATE: '가상 계좌의 최대 유효만료 기간을 초과했습니다.',
  UNAUTHORIZED_KEY: '인증되지 않은 시크릿 키 혹은 클라이언트 키 입니다.',
  INCORRECT_BASIC_AUTH_FORMAT:
    "잘못된 요청입니다. ':' 를 포함해 인코딩해주세요.",
  FAILED_INTERNAL_SYSTEM_PROCESSING:
    '내부 시스템 처리 작업이 실패했습니다. 잠시 후 다시 시도해주세요.',
  FAILED_DB_PROCESSING: '잘못된 요청 값으로 처리 중 DB 에러가 발생했습니다.',
};

export const TOSS_PAYMENTS_ERROR = {
  ...CONFIRM,
  ...CHECK,
  ...CANCEL,
  ...CARD,
  ...TRANSFER,
} as const;
