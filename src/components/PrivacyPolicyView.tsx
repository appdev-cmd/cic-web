import React from 'react';
import { LegalArticleLayout, LegalSection } from './LegalArticleLayout';
import { CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onNavigateHome: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onNavigateHome }) => {
  const sections: LegalSection[] = [
    {
      id: '01',
      title: 'Mục đích và phạm vi thu thập thông tin',
      content: (
        <div className="space-y-3">
          <p>
            Việc thu thập dữ liệu chủ yếu trên website{' '}
            <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline font-bold">
              www.cic.com.vn
            </a>{' '}
            bao gồm: họ tên, email, điện thoại, địa chỉ khách hàng... là thông tin cần thiết khi Khách hàng đăng ký sử dụng dịch vụ và để CIC liên hệ xác nhận nhằm đảm bảo quyền lợi cho khách hàng.
          </p>
          <p>
            Khách hàng có trách nhiệm tự bảo mật và lưu giữ mọi hoạt động sử dụng dịch vụ dưới tên đăng ký và hộp thư điện tử của mình. Khách hàng có trách nhiệm thông báo kịp thời cho Công ty CP Công nghệ và Tư vấn CIC về những hành vi sử dụng trái phép, lạm dụng, vi phạm bảo mật để có biện pháp xử lý phù hợp.
          </p>
        </div>
      )
    },
    {
      id: '02',
      title: 'Phạm vi sử dụng thông tin',
      content: (
        <div className="space-y-3">
          <p>Công ty sử dụng thông tin Khách hàng cung cấp để:</p>
          <ul className="space-y-2 pl-1">
            {[
              'Cung cấp các dịch vụ, phần mềm và giải pháp kỹ thuật đến khách hàng;',
              'Thực hiện chuyển giao công nghệ và đào tạo hướng dẫn sử dụng;',
              'Gửi các thông báo về các hoạt động trao đổi thông tin, tin tức sự kiện và chương trình ưu đãi;',
              'Ngăn ngừa các hoạt động phá hủy tài khoản khách hàng hoặc các hoạt động giả mạo;',
              'Liên lạc và giải quyết khiếu nại với khách hàng trong những trường hợp đặc biệt;',
              'Không sử dụng thông tin cá nhân ngoài mục đích xác nhận và liên hệ có liên quan đến hoạt động của CIC.'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-500 italic text-xs pt-1">
            Trong trường hợp có yêu cầu của cơ quan pháp luật: Công ty có trách nhiệm hợp tác cung cấp thông tin cá nhân khách hàng khi có yêu cầu bằng văn bản từ cơ quan tư pháp liên quan đến hành vi vi phạm pháp luật.
          </p>
        </div>
      )
    },
    {
      id: '03',
      title: 'Thời gian lưu trữ thông tin',
      content: (
        <p>
          Dữ liệu cá nhân của khách hàng sẽ được lưu trữ an toàn trên máy chủ của CIC cho đến khi có yêu cầu hủy bỏ từ phía khách hàng hoặc theo quy định lưu trữ dữ liệu của doanh nghiệp. Trong mọi trường hợp còn lại, thông tin cá nhân sẽ được bảo mật tuyệt đối.
        </p>
      )
    },
    {
      id: '04',
      title: 'Phương tiện tiếp cận và chỉnh sửa dữ liệu cá nhân',
      content: (
        <div className="space-y-3">
          <p>
            Khách hàng có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc yêu cầu Công ty CIC hủy bỏ thông tin cá nhân của mình bất kỳ lúc nào bằng cách gửi yêu cầu về email hỗ trợ chính thức.
          </p>
          <p>
            Khách hàng có quyền gửi phản hồi hoặc khiếu nại về chất lượng phục vụ đến Ban quản trị website{' '}
            <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline font-bold">
              www.cic.com.vn
            </a>
            . Chúng tôi cam kết xác minh và phản hồi xử lý kịp thời các đóng góp từ phía khách hàng.
          </p>
        </div>
      )
    },
    {
      id: '05',
      title: 'Cam kết bảo mật thông tin cá nhân khách hàng',
      content: (
        <div className="space-y-3">
          <p>
            Thông tin cá nhân của khách hàng tại website được cam kết bảo mật tuyệt đối theo chính sách bảo vệ dữ liệu của CIC. Việc thu thập và sử dụng thông tin chỉ được thực hiện khi có sự đồng ý của khách hàng, trừ trường hợp pháp luật quy định khác.
          </p>
          <p>
            Tuyệt đối không sử dụng, không chuyển giao, không cung cấp hay tiết lộ cho bên thứ ba về thông tin cá nhân của khách hàng khi chưa có sự đồng ý.
          </p>
          <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded-r-md text-xs text-slate-800 space-y-1">
            <span className="font-bold text-orange-900 block">Lưu ý quan trọng:</span>
            <p className="text-slate-700 leading-relaxed">
              Khách hàng cần cung cấp đầy đủ và chính xác các thông tin khi đăng ký tư vấn hoặc mua hàng. Ban quản trị CIC không chịu trách nhiệm giải quyết các khiếu nại nếu thông tin cá nhân ban đầu do khách hàng cung cấp không chính xác.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <LegalArticleLayout
      categoryTag="BẢO VỆ DỮ LIỆU CÁ NHÂN"
      title="Chính Sách Bảo Mật"
      subtitle="Chính sách chi tiết về mục đích, phạm vi thu thập, lưu trữ và cam kết bảo mật thông tin khách hàng tại Công ty Cổ phần Công nghệ và Tư vấn CIC."
      lastUpdated="19/07/2026"
      readingTime="3 phút"
      sections={sections}
      onNavigateHome={onNavigateHome}
    />
  );
};
