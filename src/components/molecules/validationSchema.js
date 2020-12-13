import * as Yup from 'yup';

// 全角文字以外を検出する正規表現
const notFullWidth = /^[\x20-\x7e]*$/;
// 英数字（文字A～Z、数字0～9）とアンダースコア以外の記号を検出する正規表現
const onlyLettersOrNumbersOrUnderscores = /^(^([A-Za-z0-9_])+)$/;

export const validationSchema = Yup.object({
  user: Yup.string()
    .required('必須項目です')
    .min(4, '4~15文字で入力してください')
    .max(15, '4~15文字で入力してください')
    .matches(notFullWidth, '不正な Twitter ユーザー名です')
    .matches(
      onlyLettersOrNumbersOrUnderscores,
      '不正な Twitter ユーザー名です'
    ),
});
