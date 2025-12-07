import { FaEnvelope, FaPhone } from 'react-icons/fa';
import useTranslation from '../../hooks/useTranslation';
import './TopHeader.css';

const TopHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="top-header">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center py-2 top-header-content">
          <div className="d-flex align-items-center gap-3">
            <FaEnvelope className="top-header-icon" />
            <span>{t('email')}</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <FaPhone className="top-header-icon" />
            <span>8341540001</span>
            <span>•</span>
            <span>8367600045</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;

