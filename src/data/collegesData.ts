export interface InstitutionSuggestion {
  name: string;
  city: string;
  stateOrCountry: string;
  category: 'iit' | 'nit' | 'iiit' | 'university' | 'engineering' | 'institute' | 'college' | 'company' | 'international';
  shortCode?: string;
  popular?: boolean;
}

export const INSTITUTIONS_DATABASE: InstitutionSuggestion[] = [
  // ==========================================
  // ALL 23 INDIAN INSTITUTES OF TECHNOLOGY (IITs)
  // ==========================================
  {
    name: 'Indian Institute of Technology Delhi (IIT Delhi)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'iit',
    shortCode: 'IITD IIT Delhi',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Bombay (IIT Bombay / Mumbai)',
    city: 'Mumbai',
    stateOrCountry: 'Maharashtra, India',
    category: 'iit',
    shortCode: 'IITB IIT Bombay IIT Mumbai',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Madras (IIT Madras / Chennai)',
    city: 'Chennai',
    stateOrCountry: 'Tamil Nadu, India',
    category: 'iit',
    shortCode: 'IITM IIT Madras IIT Chennai',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Kanpur (IIT Kanpur)',
    city: 'Kanpur',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'iit',
    shortCode: 'IITK IIT Kanpur',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Kharagpur (IIT Kharagpur)',
    city: 'Kharagpur',
    stateOrCountry: 'West Bengal, India',
    category: 'iit',
    shortCode: 'IIT KGP IIT Kharagpur',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Roorkee (IIT Roorkee)',
    city: 'Roorkee',
    stateOrCountry: 'Uttarakhand, India',
    category: 'iit',
    shortCode: 'IITR IIT Roorkee',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Guwahati (IIT Guwahati)',
    city: 'Guwahati',
    stateOrCountry: 'Assam, India',
    category: 'iit',
    shortCode: 'IITG IIT Guwahati',
    popular: true
  },
  {
    name: 'Indian Institute of Technology (BHU) Varanasi (IIT BHU)',
    city: 'Varanasi',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'iit',
    shortCode: 'IIT BHU Varanasi',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Hyderabad (IIT Hyderabad)',
    city: 'Hyderabad',
    stateOrCountry: 'Telangana, India',
    category: 'iit',
    shortCode: 'IITH IIT Hyderabad',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Ropar (IIT Ropar)',
    city: 'Rupnagar / Ropar',
    stateOrCountry: 'Punjab, India',
    category: 'iit',
    shortCode: 'IIT Ropar IIT Rupnagar',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Gandhinagar (IIT Gandhinagar / Ahmedabad)',
    city: 'Gandhinagar',
    stateOrCountry: 'Gujarat, India',
    category: 'iit',
    shortCode: 'IIT Gandhinagar IITGN Ahmedabad',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Indore (IIT Indore)',
    city: 'Indore',
    stateOrCountry: 'Madhya Pradesh, India',
    category: 'iit',
    shortCode: 'IITI IIT Indore',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Mandi (IIT Mandi)',
    city: 'Mandi',
    stateOrCountry: 'Himachal Pradesh, India',
    category: 'iit',
    shortCode: 'IIT Mandi',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Patna (IIT Patna)',
    city: 'Patna',
    stateOrCountry: 'Bihar, India',
    category: 'iit',
    shortCode: 'IITP IIT Patna',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Jodhpur (IIT Jodhpur)',
    city: 'Jodhpur',
    stateOrCountry: 'Rajasthan, India',
    category: 'iit',
    shortCode: 'IITJ IIT Jodhpur',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Bhubaneswar (IIT Bhubaneswar)',
    city: 'Bhubaneswar',
    stateOrCountry: 'Odisha, India',
    category: 'iit',
    shortCode: 'IIT BBS IIT Bhubaneswar',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Tirupati (IIT Tirupati)',
    city: 'Tirupati',
    stateOrCountry: 'Andhra Pradesh, India',
    category: 'iit',
    shortCode: 'IIT Tirupati',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Palakkad (IIT Palakkad)',
    city: 'Palakkad',
    stateOrCountry: 'Kerala, India',
    category: 'iit',
    shortCode: 'IIT Palakkad',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Goa (IIT Goa)',
    city: 'Ponda / Farmagudi',
    stateOrCountry: 'Goa, India',
    category: 'iit',
    shortCode: 'IIT Goa',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Jammu (IIT Jammu)',
    city: 'Jammu',
    stateOrCountry: 'Jammu & Kashmir, India',
    category: 'iit',
    shortCode: 'IIT Jammu',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Dharwad (IIT Dharwad)',
    city: 'Dharwad',
    stateOrCountry: 'Karnataka, India',
    category: 'iit',
    shortCode: 'IIT Dharwad',
    popular: true
  },
  {
    name: 'Indian Institute of Technology Bhilai (IIT Bhilai)',
    city: 'Bhilai / Durg',
    stateOrCountry: 'Chhattisgarh, India',
    category: 'iit',
    shortCode: 'IIT Bhilai',
    popular: true
  },
  {
    name: 'Indian Institute of Technology (ISM) Dhanbad (IIT ISM Dhanbad)',
    city: 'Dhanbad',
    stateOrCountry: 'Jharkhand, India',
    category: 'iit',
    shortCode: 'IIT ISM Dhanbad',
    popular: true
  },

  // ==========================================
  // ALL D. Y. PATIL UNIVERSITIES & CAMPUSES
  // ==========================================
  {
    name: 'D. Y. Patil University, Navi Mumbai (Nerul)',
    city: 'Navi Mumbai / Mumbai',
    stateOrCountry: 'Maharashtra, India',
    category: 'university',
    shortCode: 'DY Patil Mumbai DY Patil Navi Mumbai DY Patil Nerul',
    popular: true
  },
  {
    name: 'Dr. D. Y. Patil Vidyapeeth (Deemed to be University), Pimpri, Pune',
    city: 'Pune',
    stateOrCountry: 'Maharashtra, India',
    category: 'university',
    shortCode: 'DY Patil Pune DY Patil Pimpri',
    popular: true
  },
  {
    name: 'D. Y. Patil International University (DYPIU), Akurdi, Pune',
    city: 'Pune',
    stateOrCountry: 'Maharashtra, India',
    category: 'university',
    shortCode: 'DYPIU DY Patil Akurdi Pune',
    popular: true
  },
  {
    name: 'D. Y. Patil College of Engineering (DYPCOE), Akurdi, Pune',
    city: 'Pune',
    stateOrCountry: 'Maharashtra, India',
    category: 'engineering',
    shortCode: 'DYPCOE Akurdi DY Patil Engineering',
    popular: true
  },
  {
    name: 'Ramrao Adik Institute of Technology (RAIT) - D. Y. Patil University',
    city: 'Navi Mumbai / Mumbai',
    stateOrCountry: 'Maharashtra, India',
    category: 'engineering',
    shortCode: 'RAIT DY Patil Mumbai Nerul',
    popular: true
  },
  {
    name: 'Dr. D. Y. Patil School of Engineering, Lohegaon, Pune',
    city: 'Pune',
    stateOrCountry: 'Maharashtra, India',
    category: 'engineering',
    shortCode: 'DY Patil Lohegaon Pune',
    popular: true
  },
  {
    name: 'D. Y. Patil Education Society (Deemed University), Kolhapur',
    city: 'Kolhapur',
    stateOrCountry: 'Maharashtra, India',
    category: 'university',
    shortCode: 'DY Patil Kolhapur',
    popular: true
  },
  {
    name: 'D. Y. Patil Agriculture & Technical University, Talsande, Kolhapur',
    city: 'Kolhapur',
    stateOrCountry: 'Maharashtra, India',
    category: 'university',
    shortCode: 'DY Patil Talsande Kolhapur',
    popular: true
  },

  // ==========================================
  // ALL SRM UNIVERSITIES & CAMPUSES
  // ==========================================
  {
    name: 'SRM Institute of Science and Technology (SRM IST), Kattankulathur, Chennai',
    city: 'Chennai',
    stateOrCountry: 'Tamil Nadu, India',
    category: 'university',
    shortCode: 'SRM Chennai SRM KTR SRM IST Kattankulathur',
    popular: true
  },
  {
    name: 'SRM Institute of Science and Technology, Ramapuram Campus, Chennai',
    city: 'Chennai',
    stateOrCountry: 'Tamil Nadu, India',
    category: 'university',
    shortCode: 'SRM Ramapuram Chennai',
    popular: true
  },
  {
    name: 'SRM Institute of Science and Technology, Vadapalani Campus, Chennai',
    city: 'Chennai',
    stateOrCountry: 'Tamil Nadu, India',
    category: 'university',
    shortCode: 'SRM Vadapalani Chennai',
    popular: true
  },
  {
    name: 'SRM University AP (Amaravati)',
    city: 'Amaravati / Vijayawada',
    stateOrCountry: 'Andhra Pradesh, India',
    category: 'university',
    shortCode: 'SRM AP SRM Amaravati',
    popular: true
  },
  {
    name: 'SRM University Delhi-NCR, Sonepat',
    city: 'Sonepat / Delhi-NCR',
    stateOrCountry: 'Haryana, India',
    category: 'university',
    shortCode: 'SRM Delhi SRM Sonepat SRM NCR',
    popular: true
  },
  {
    name: 'SRM University Sikkim',
    city: 'Gangtok',
    stateOrCountry: 'Sikkim, India',
    category: 'university',
    shortCode: 'SRM Sikkim',
    popular: true
  },

  // ==========================================
  // LUCKNOW & UTTAR PRADESH UNIVERSITIES
  // ==========================================
  {
    name: 'University of Lucknow (LU)',
    city: 'Lucknow',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'Lucknow University LU',
    popular: true
  },
  {
    name: 'Institute of Engineering and Technology (IET Lucknow)',
    city: 'Lucknow',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'engineering',
    shortCode: 'IET Lucknow IET AKTU',
    popular: true
  },
  {
    name: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
    city: 'Lucknow',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'AKTU UPTU Lucknow',
    popular: true
  },
  {
    name: 'Babu Banarasi Das University (BBDU)',
    city: 'Lucknow',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'BBD Lucknow BBDU',
    popular: true
  },
  {
    name: 'BBD Northern India Institute of Technology (BBDNIIT)',
    city: 'Lucknow',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'engineering',
    shortCode: 'BBDNIIT Lucknow',
    popular: true
  },
  {
    name: 'Integral University',
    city: 'Lucknow',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'Integral University Lucknow',
    popular: true
  },
  {
    name: 'Amity University Lucknow Campus',
    city: 'Lucknow',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'Amity Lucknow',
    popular: true
  },
  {
    name: 'Indian Institute of Information Technology Lucknow (IIIT Lucknow)',
    city: 'Lucknow',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'iiit',
    shortCode: 'IIIT Lucknow IIITL',
    popular: true
  },
  {
    name: 'Indian Institute of Management Lucknow (IIM Lucknow)',
    city: 'Lucknow',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'institute',
    shortCode: 'IIM Lucknow IIML',
    popular: true
  },
  {
    name: 'King George’s Medical University (KGMU)',
    city: 'Lucknow',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'KGMU Lucknow',
    popular: true
  },
  {
    name: 'Shri Ramswaroop Memorial University (SRMU)',
    city: 'Lucknow / Barabanki',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'SRMU Lucknow',
    popular: true
  },
  {
    name: 'Babasaheb Bhimrao Ambedkar University (BBAU)',
    city: 'Lucknow',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'BBAU Lucknow',
    popular: true
  },
  {
    name: 'Harcourt Butler Technical University (HBTU Kanpur)',
    city: 'Kanpur',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'engineering',
    shortCode: 'HBTU HBTI Kanpur',
    popular: true
  },
  {
    name: 'Motilal Nehru National Institute of Technology (MNNIT Allahabad)',
    city: 'Prayagraj / Allahabad',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'nit',
    shortCode: 'MNNIT NIT Allahabad Prayagraj',
    popular: true
  },
  {
    name: 'Indian Institute of Information Technology Allahabad (IIIT Allahabad)',
    city: 'Prayagraj / Allahabad',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'iiit',
    shortCode: 'IIITA IIIT Allahabad',
    popular: true
  },

  // ==========================================
  // NOIDA & DELHI NCR
  // ==========================================
  {
    name: 'Noida Institute of Engineering and Technology (NIET)',
    city: 'Noida',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'engineering',
    shortCode: 'NIET Noida',
    popular: true
  },
  {
    name: 'Amity University Noida',
    city: 'Noida',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'Amity Noida',
    popular: true
  },
  {
    name: 'Jaypee Institute of Information Technology (JIIT)',
    city: 'Noida',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'engineering',
    shortCode: 'JIIT Noida Sector 62',
    popular: true
  },
  {
    name: 'JSS Academy of Technical Education (JSSATE)',
    city: 'Noida',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'engineering',
    shortCode: 'JSS Noida',
    popular: true
  },
  {
    name: 'Galgotias University',
    city: 'Greater Noida',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'Galgotias Greater Noida',
    popular: true
  },
  {
    name: 'Galgotias College of Engineering and Technology (GCET)',
    city: 'Greater Noida',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'engineering',
    shortCode: 'GCET Greater Noida',
    popular: true
  },
  {
    name: 'GL Bajaj Institute of Technology and Management',
    city: 'Greater Noida',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'engineering',
    shortCode: 'GL Bajaj Noida',
    popular: true
  },
  {
    name: 'Bennett University',
    city: 'Greater Noida',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'Bennett Greater Noida Times',
    popular: true
  },
  {
    name: 'Shiv Nadar University (SNU)',
    city: 'Greater Noida',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'SNU Greater Noida',
    popular: true
  },
  {
    name: 'Sharda University',
    city: 'Greater Noida',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'university',
    shortCode: 'Sharda Greater Noida',
    popular: true
  },
  {
    name: 'AKGEC - Ajay Kumar Garg Engineering College',
    city: 'Ghaziabad / NCR',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'engineering',
    shortCode: 'AKGEC Ghaziabad',
    popular: true
  },
  {
    name: 'KIET Group of Institutions',
    city: 'Ghaziabad / Delhi NCR',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'engineering',
    shortCode: 'KIET Ghaziabad',
    popular: true
  },
  {
    name: 'IMS Engineering College',
    city: 'Ghaziabad / NCR',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'engineering',
    shortCode: 'IMSEC Ghaziabad',
    popular: true
  },
  {
    name: 'Delhi Technological University (DTU / DCE)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'engineering',
    shortCode: 'DTU DCE Delhi',
    popular: true
  },
  {
    name: 'Netaji Subhas University of Technology (NSUT / NSIT)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'engineering',
    shortCode: 'NSUT NSIT Delhi',
    popular: true
  },
  {
    name: 'Indraprastha Institute of Information Technology Delhi (IIIT Delhi)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'iiit',
    shortCode: 'IIITD IIIT Delhi',
    popular: true
  },
  {
    name: 'Maharaja Agrasen Institute of Technology (MAIT)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'engineering',
    shortCode: 'MAIT IPU Delhi',
    popular: true
  },
  {
    name: 'Maharaja Surajmal Institute of Technology (MSIT)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'engineering',
    shortCode: 'MSIT IPU Delhi',
    popular: true
  },
  {
    name: 'Bharati Vidyapeeth College of Engineering (BVCOE)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'engineering',
    shortCode: 'BVCOE Delhi IPU',
    popular: true
  },
  {
    name: 'Indira Gandhi Delhi Technical University for Women (IGDTUW)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'engineering',
    shortCode: 'IGDTUW Delhi',
    popular: true
  },
  {
    name: 'Jamia Millia Islamia (JMI)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'university',
    shortCode: 'JMI Jamia Delhi',
    popular: true
  },
  {
    name: 'Jawaharlal Nehru University (JNU)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'university',
    shortCode: 'JNU Delhi',
    popular: true
  },
  {
    name: 'University of Delhi (DU)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'university',
    shortCode: 'DU Delhi University St Stephens SRCC Hindu',
    popular: true
  },

  // ==========================================
  // TOP NATIONAL INSTITUTES OF TECHNOLOGY (NITs)
  // ==========================================
  {
    name: 'National Institute of Technology Tiruchirappalli (NIT Trichy)',
    city: 'Tiruchirappalli',
    stateOrCountry: 'Tamil Nadu, India',
    category: 'nit',
    shortCode: 'NITT NIT Trichy',
    popular: true
  },
  {
    name: 'National Institute of Technology Karnataka (NIT Surathkal)',
    city: 'Mangaluru / Surathkal',
    stateOrCountry: 'Karnataka, India',
    category: 'nit',
    shortCode: 'NITK NIT Surathkal',
    popular: true
  },
  {
    name: 'National Institute of Technology Warangal (NIT Warangal)',
    city: 'Warangal',
    stateOrCountry: 'Telangana, India',
    category: 'nit',
    shortCode: 'NITW NIT Warangal',
    popular: true
  },
  {
    name: 'National Institute of Technology Rourkela (NIT Rourkela)',
    city: 'Rourkela',
    stateOrCountry: 'Odisha, India',
    category: 'nit',
    shortCode: 'NITR NIT Rourkela',
    popular: true
  },
  {
    name: 'National Institute of Technology Calicut (NIT Calicut)',
    city: 'Calicut / Kozhikode',
    stateOrCountry: 'Kerala, India',
    category: 'nit',
    shortCode: 'NITC NIT Calicut',
    popular: true
  },
  {
    name: 'Malaviya National Institute of Technology (MNIT Jaipur)',
    city: 'Jaipur',
    stateOrCountry: 'Rajasthan, India',
    category: 'nit',
    shortCode: 'MNIT Jaipur NIT Jaipur',
    popular: true
  },
  {
    name: 'Visvesvaraya National Institute of Technology (VNIT Nagpur)',
    city: 'Nagpur',
    stateOrCountry: 'Maharashtra, India',
    category: 'nit',
    shortCode: 'VNIT Nagpur NIT Nagpur',
    popular: true
  },
  {
    name: 'Sardar Vallabhbhai National Institute of Technology (SVNIT Surat)',
    city: 'Surat',
    stateOrCountry: 'Gujarat, India',
    category: 'nit',
    shortCode: 'SVNIT Surat NIT Surat',
    popular: true
  },
  {
    name: 'National Institute of Technology Kurukshetra (NIT Kurukshetra)',
    city: 'Kurukshetra',
    stateOrCountry: 'Haryana, India',
    category: 'nit',
    shortCode: 'NIT Kurukshetra NIT KKR',
    popular: true
  },
  {
    name: 'National Institute of Technology Durgapur (NIT Durgapur)',
    city: 'Durgapur',
    stateOrCountry: 'West Bengal, India',
    category: 'nit',
    shortCode: 'NIT Durgapur',
    popular: true
  },
  {
    name: 'National Institute of Technology Silchar (NIT Silchar)',
    city: 'Silchar',
    stateOrCountry: 'Assam, India',
    category: 'nit',
    shortCode: 'NIT Silchar',
    popular: true
  },
  {
    name: 'National Institute of Technology Patna (NIT Patna)',
    city: 'Patna',
    stateOrCountry: 'Bihar, India',
    category: 'nit',
    shortCode: 'NIT Patna',
    popular: true
  },
  {
    name: 'National Institute of Technology Jalandhar (NIT Jalandhar)',
    city: 'Jalandhar',
    stateOrCountry: 'Punjab, India',
    category: 'nit',
    shortCode: 'NIT Jalandhar Dr B R Ambedkar',
    popular: true
  },
  {
    name: 'Maulana Azad National Institute of Technology (MANIT Bhopal)',
    city: 'Bhopal',
    stateOrCountry: 'Madhya Pradesh, India',
    category: 'nit',
    shortCode: 'MANIT Bhopal NIT Bhopal',
    popular: true
  },
  {
    name: 'National Institute of Technology Raipur (NIT Raipur)',
    city: 'Raipur',
    stateOrCountry: 'Chhattisgarh, India',
    category: 'nit',
    shortCode: 'NIT Raipur',
    popular: true
  },
  {
    name: 'National Institute of Technology Jamshedpur (NIT Jamshedpur)',
    city: 'Jamshedpur',
    stateOrCountry: 'Jharkhand, India',
    category: 'nit',
    shortCode: 'NIT Jamshedpur',
    popular: true
  },
  {
    name: 'National Institute of Technology Goa (NIT Goa)',
    city: 'Ponda / Cuncolim',
    stateOrCountry: 'Goa, India',
    category: 'nit',
    shortCode: 'NIT Goa',
    popular: true
  },
  {
    name: 'National Institute of Technology Delhi (NIT Delhi)',
    city: 'New Delhi',
    stateOrCountry: 'Delhi, India',
    category: 'nit',
    shortCode: 'NIT Delhi NITD',
    popular: true
  },

  // ==========================================
  // BITS PILANI & IIITs & DEEMED UNIVERSITIES
  // ==========================================
  {
    name: 'BITS Pilani (Pilani Campus)',
    city: 'Pilani',
    stateOrCountry: 'Rajasthan, India',
    category: 'engineering',
    shortCode: 'BITS Pilani',
    popular: true
  },
  {
    name: 'BITS Pilani (Goa Campus)',
    city: 'Goa',
    stateOrCountry: 'Goa, India',
    category: 'engineering',
    shortCode: 'BITS Goa',
    popular: true
  },
  {
    name: 'BITS Pilani (Hyderabad Campus)',
    city: 'Hyderabad',
    stateOrCountry: 'Telangana, India',
    category: 'engineering',
    shortCode: 'BITS Hyderabad',
    popular: true
  },
  {
    name: 'International Institute of Information Technology Hyderabad (IIIT Hyderabad)',
    city: 'Hyderabad',
    stateOrCountry: 'Telangana, India',
    category: 'iiit',
    shortCode: 'IIIT-H IIIT Hyderabad',
    popular: true
  },
  {
    name: 'International Institute of Information Technology Bangalore (IIIT-B)',
    city: 'Bengaluru',
    stateOrCountry: 'Karnataka, India',
    category: 'iiit',
    shortCode: 'IIIT-B IIIT Bangalore',
    popular: true
  },
  {
    name: 'IIIT Pune (Indian Institute of Information Technology Pune)',
    city: 'Pune',
    stateOrCountry: 'Maharashtra, India',
    category: 'iiit',
    shortCode: 'IIIT Pune',
    popular: true
  },
  {
    name: 'Vellore Institute of Technology (VIT Vellore)',
    city: 'Vellore',
    stateOrCountry: 'Tamil Nadu, India',
    category: 'university',
    shortCode: 'VIT Vellore VIT University',
    popular: true
  },
  {
    name: 'VIT Chennai',
    city: 'Chennai',
    stateOrCountry: 'Tamil Nadu, India',
    category: 'university',
    shortCode: 'VIT Chennai',
    popular: true
  },
  {
    name: 'VIT Bhopal',
    city: 'Bhopal / Kothri-Kalan',
    stateOrCountry: 'Madhya Pradesh, India',
    category: 'university',
    shortCode: 'VIT Bhopal',
    popular: true
  },
  {
    name: 'VIT-AP University',
    city: 'Amaravati',
    stateOrCountry: 'Andhra Pradesh, India',
    category: 'university',
    shortCode: 'VIT AP Amaravati',
    popular: true
  },
  {
    name: 'Thapar Institute of Engineering and Technology (TIET)',
    city: 'Patiala',
    stateOrCountry: 'Punjab, India',
    category: 'university',
    shortCode: 'Thapar Patiala TIET',
    popular: true
  },
  {
    name: 'Chandigarh University (CU)',
    city: 'Mohali / Chandigarh',
    stateOrCountry: 'Punjab, India',
    category: 'university',
    shortCode: 'CU Chandigarh University',
    popular: true
  },
  {
    name: 'Lovely Professional University (LPU)',
    city: 'Jalandhar / Phagwara',
    stateOrCountry: 'Punjab, India',
    category: 'university',
    shortCode: 'LPU Jalandhar',
    popular: true
  },
  {
    name: 'Chitkara University',
    city: 'Rajpura / Chandigarh',
    stateOrCountry: 'Punjab, India',
    category: 'university',
    shortCode: 'Chitkara Chandigarh',
    popular: true
  },
  {
    name: 'Punjab Engineering College (PEC Chandigarh)',
    city: 'Chandigarh',
    stateOrCountry: 'Chandigarh, India',
    category: 'engineering',
    shortCode: 'PEC Chandigarh',
    popular: true
  },

  // ==========================================
  // BANGALORE & KARNATAKA COLLEGES
  // ==========================================
  {
    name: 'Indian Institute of Science (IISc Bangalore)',
    city: 'Bengaluru',
    stateOrCountry: 'Karnataka, India',
    category: 'university',
    shortCode: 'IISc Bangalore',
    popular: true
  },
  {
    name: 'RV College of Engineering (RVCE)',
    city: 'Bengaluru',
    stateOrCountry: 'Karnataka, India',
    category: 'engineering',
    shortCode: 'RVCE RV Bangalore',
    popular: true
  },
  {
    name: 'PES University',
    city: 'Bengaluru',
    stateOrCountry: 'Karnataka, India',
    category: 'university',
    shortCode: 'PES Bangalore PESIT',
    popular: true
  },
  {
    name: 'BMS College of Engineering (BMSCE)',
    city: 'Bengaluru',
    stateOrCountry: 'Karnataka, India',
    category: 'engineering',
    shortCode: 'BMSCE BMS Bangalore',
    popular: true
  },
  {
    name: 'Ramaiah Institute of Technology (MSRIT)',
    city: 'Bengaluru',
    stateOrCountry: 'Karnataka, India',
    category: 'engineering',
    shortCode: 'MSRIT Ramaiah Bangalore',
    popular: true
  },
  {
    name: 'Manipal Institute of Technology (MIT Manipal)',
    city: 'Manipal / Udupi',
    stateOrCountry: 'Karnataka, India',
    category: 'engineering',
    shortCode: 'MIT Manipal MAHE',
    popular: true
  },
  {
    name: 'Dayananda Sagar College of Engineering (DSCE)',
    city: 'Bengaluru',
    stateOrCountry: 'Karnataka, India',
    category: 'engineering',
    shortCode: 'DSCE Dayananda Sagar Bangalore',
    popular: true
  },
  {
    name: 'Christ University',
    city: 'Bengaluru',
    stateOrCountry: 'Karnataka, India',
    category: 'university',
    shortCode: 'Christ Bangalore',
    popular: true
  },

  // ==========================================
  // MUMBAI & PUNE (MAHARASHTRA)
  // ==========================================
  {
    name: 'College of Engineering Pune (COEP Technological University)',
    city: 'Pune',
    stateOrCountry: 'Maharashtra, India',
    category: 'engineering',
    shortCode: 'COEP Pune',
    popular: true
  },
  {
    name: 'Pune Institute of Computer Technology (PICT)',
    city: 'Pune',
    stateOrCountry: 'Maharashtra, India',
    category: 'engineering',
    shortCode: 'PICT Pune',
    popular: true
  },
  {
    name: 'Vishwakarma Institute of Technology (VIT Pune)',
    city: 'Pune',
    stateOrCountry: 'Maharashtra, India',
    category: 'engineering',
    shortCode: 'VIT Pune',
    popular: true
  },
  {
    name: 'MIT World Peace University (MIT-WPU)',
    city: 'Pune',
    stateOrCountry: 'Maharashtra, India',
    category: 'university',
    shortCode: 'MIT WPU Pune MIT Kothrud',
    popular: true
  },
  {
    name: 'Symbiosis International University (SIU / SIT)',
    city: 'Pune',
    stateOrCountry: 'Maharashtra, India',
    category: 'university',
    shortCode: 'Symbiosis Pune SIT SIU',
    popular: true
  },
  {
    name: 'Veermata Jijabai Technological Institute (VJTI Mumbai)',
    city: 'Mumbai',
    stateOrCountry: 'Maharashtra, India',
    category: 'engineering',
    shortCode: 'VJTI Mumbai',
    popular: true
  },
  {
    name: 'Sardar Patel Institute of Technology (SPIT Mumbai)',
    city: 'Mumbai',
    stateOrCountry: 'Maharashtra, India',
    category: 'engineering',
    shortCode: 'SPIT Andheri Mumbai',
    popular: true
  },
  {
    name: 'Dwarkadas J. Sanghvi College of Engineering (DJSCE)',
    city: 'Mumbai',
    stateOrCountry: 'Maharashtra, India',
    category: 'engineering',
    shortCode: 'DJ Sanghvi DJSCE Mumbai',
    popular: true
  },
  {
    name: 'NMIMS (Mukesh Patel School of Technology Management & Engineering)',
    city: 'Mumbai',
    stateOrCountry: 'Maharashtra, India',
    category: 'university',
    shortCode: 'NMIMS MPSTME Mumbai',
    popular: true
  },
  {
    name: 'K. J. Somaiya College of Engineering',
    city: 'Mumbai',
    stateOrCountry: 'Maharashtra, India',
    category: 'engineering',
    shortCode: 'Somaiya Mumbai KJSCE',
    popular: true
  },
  {
    name: 'Thadomal Shahani Engineering College (TSEC)',
    city: 'Mumbai',
    stateOrCountry: 'Maharashtra, India',
    category: 'engineering',
    shortCode: 'TSEC Bandra Mumbai',
    popular: true
  },

  // ==========================================
  // HYDERABAD, CHENNAI, KOLKATA & OTHER CITIES
  // ==========================================
  {
    name: 'University College of Engineering, Osmania University (OU)',
    city: 'Hyderabad',
    stateOrCountry: 'Telangana, India',
    category: 'engineering',
    shortCode: 'Osmania OU Hyderabad',
    popular: true
  },
  {
    name: 'Jawaharlal Nehru Technological University Hyderabad (JNTUH)',
    city: 'Hyderabad',
    stateOrCountry: 'Telangana, India',
    category: 'university',
    shortCode: 'JNTU JNTUH Hyderabad',
    popular: true
  },
  {
    name: 'Chaitanya Bharathi Institute of Technology (CBIT)',
    city: 'Hyderabad',
    stateOrCountry: 'Telangana, India',
    category: 'engineering',
    shortCode: 'CBIT Hyderabad',
    popular: true
  },
  {
    name: 'College of Engineering, Guindy (Anna University CEG)',
    city: 'Chennai',
    stateOrCountry: 'Tamil Nadu, India',
    category: 'engineering',
    shortCode: 'CEG Anna University Chennai',
    popular: true
  },
  {
    name: 'SSN College of Engineering',
    city: 'Chennai',
    stateOrCountry: 'Tamil Nadu, India',
    category: 'engineering',
    shortCode: 'SSN Chennai',
    popular: true
  },
  {
    name: 'PSG College of Technology',
    city: 'Coimbatore',
    stateOrCountry: 'Tamil Nadu, India',
    category: 'engineering',
    shortCode: 'PSG Coimbatore PSG Tech',
    popular: true
  },
  {
    name: 'Jadavpur University',
    city: 'Kolkata',
    stateOrCountry: 'West Bengal, India',
    category: 'university',
    shortCode: 'JU Jadavpur Kolkata',
    popular: true
  },
  {
    name: 'IIEST Shibpur (Indian Institute of Engineering Science and Technology)',
    city: 'Howrah / Kolkata',
    stateOrCountry: 'West Bengal, India',
    category: 'institute',
    shortCode: 'IIEST Shibpur BESU Kolkata',
    popular: true
  },
  {
    name: 'Heritage Institute of Technology (HIT)',
    city: 'Kolkata',
    stateOrCountry: 'West Bengal, India',
    category: 'engineering',
    shortCode: 'HIT Kolkata Heritage',
    popular: true
  },
  {
    name: 'Institute of Engineering and Management (IEM Kolkata)',
    city: 'Kolkata',
    stateOrCountry: 'West Bengal, India',
    category: 'engineering',
    shortCode: 'IEM Kolkata Sector V',
    popular: true
  },
  {
    name: 'Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)',
    city: 'Gandhinagar / Ahmedabad',
    stateOrCountry: 'Gujarat, India',
    category: 'institute',
    shortCode: 'DA-IICT DAICT Gandhinagar Ahmedabad',
    popular: true
  },
  {
    name: 'Nirma University',
    city: 'Ahmedabad',
    stateOrCountry: 'Gujarat, India',
    category: 'university',
    shortCode: 'Nirma Ahmedabad',
    popular: true
  },
  {
    name: 'The LNM Institute of Information Technology (LNMIIT)',
    city: 'Jaipur',
    stateOrCountry: 'Rajasthan, India',
    category: 'institute',
    shortCode: 'LNMIIT Jaipur',
    popular: true
  },

  // ==========================================
  // TOP GLOBAL UNIVERSITIES WORLDWIDE
  // ==========================================
  {
    name: 'Stanford University',
    city: 'Stanford / Silicon Valley, California',
    stateOrCountry: 'United States',
    category: 'international',
    shortCode: 'Stanford USA',
    popular: true
  },
  {
    name: 'Massachusetts Institute of Technology (MIT)',
    city: 'Cambridge, Massachusetts',
    stateOrCountry: 'United States',
    category: 'international',
    shortCode: 'MIT USA Boston',
    popular: true
  },
  {
    name: 'Harvard University',
    city: 'Cambridge, Massachusetts',
    stateOrCountry: 'United States',
    category: 'international',
    shortCode: 'Harvard USA',
    popular: true
  },
  {
    name: 'Carnegie Mellon University (CMU)',
    city: 'Pittsburgh, Pennsylvania',
    stateOrCountry: 'United States',
    category: 'international',
    shortCode: 'CMU USA',
    popular: true
  },
  {
    name: 'University of California, Berkeley (UC Berkeley)',
    city: 'Berkeley, California',
    stateOrCountry: 'United States',
    category: 'international',
    shortCode: 'UC Berkeley UCB Cal',
    popular: true
  },
  {
    name: 'University of Oxford',
    city: 'Oxford',
    stateOrCountry: 'United Kingdom',
    category: 'international',
    shortCode: 'Oxford UK',
    popular: true
  },
  {
    name: 'University of Cambridge',
    city: 'Cambridge',
    stateOrCountry: 'United Kingdom',
    category: 'international',
    shortCode: 'Cambridge UK',
    popular: true
  },
  {
    name: 'Imperial College London',
    city: 'London',
    stateOrCountry: 'United Kingdom',
    category: 'international',
    shortCode: 'Imperial London UK',
    popular: true
  },
  {
    name: 'National University of Singapore (NUS)',
    city: 'Singapore',
    stateOrCountry: 'Singapore',
    category: 'international',
    shortCode: 'NUS Singapore',
    popular: true
  },
  {
    name: 'Nanyang Technological University (NTU)',
    city: 'Singapore',
    stateOrCountry: 'Singapore',
    category: 'international',
    shortCode: 'NTU Singapore',
    popular: true
  },
  {
    name: 'University of Waterloo',
    city: 'Waterloo, Ontario',
    stateOrCountry: 'Canada',
    category: 'international',
    shortCode: 'Waterloo Canada',
    popular: true
  },
  {
    name: 'University of Toronto',
    city: 'Toronto, Ontario',
    stateOrCountry: 'Canada',
    category: 'international',
    shortCode: 'U of T Toronto Canada',
    popular: true
  },
  {
    name: 'University of Melbourne',
    city: 'Melbourne, Victoria',
    stateOrCountry: 'Australia',
    category: 'international',
    shortCode: 'UniMelb Melbourne Australia',
    popular: true
  },
  {
    name: 'University of New South Wales (UNSW Sydney)',
    city: 'Sydney, NSW',
    stateOrCountry: 'Australia',
    category: 'international',
    shortCode: 'UNSW Sydney Australia',
    popular: true
  },
  {
    name: 'ETH Zurich (Swiss Federal Institute of Technology)',
    city: 'Zurich',
    stateOrCountry: 'Switzerland',
    category: 'international',
    shortCode: 'ETH Zurich Switzerland',
    popular: true
  },
  {
    name: 'Technical University of Munich (TUM)',
    city: 'Munich',
    stateOrCountry: 'Germany',
    category: 'international',
    shortCode: 'TUM Munich Germany',
    popular: true
  },
  {
    name: 'University of Tokyo',
    city: 'Tokyo',
    stateOrCountry: 'Japan',
    category: 'international',
    shortCode: 'Todai Tokyo Japan',
    popular: true
  },

  // ==========================================
  // TOP GLOBAL TECH COMPANIES (For Working Professionals)
  // ==========================================
  {
    name: 'Google LLC',
    city: 'Mountain View / Bengaluru / Hyderabad / Gurugram',
    stateOrCountry: 'Global / India',
    category: 'company',
    shortCode: 'Google Alphabet',
    popular: true
  },
  {
    name: 'Microsoft Corporation',
    city: 'Redmond / Hyderabad / Bengaluru / Noida',
    stateOrCountry: 'Global / India',
    category: 'company',
    shortCode: 'Microsoft MSFT IDC',
    popular: true
  },
  {
    name: 'Amazon / AWS',
    city: 'Seattle / Bengaluru / Hyderabad / Chennai',
    stateOrCountry: 'Global / India',
    category: 'company',
    shortCode: 'Amazon AWS',
    popular: true
  },
  {
    name: 'Apple',
    city: 'Cupertino / Hyderabad / Bengaluru',
    stateOrCountry: 'Global / India',
    category: 'company',
    shortCode: 'Apple AAPL',
    popular: true
  },
  {
    name: 'Meta (Facebook)',
    city: 'Menlo Park / Bengaluru / Gurugram',
    stateOrCountry: 'Global / India',
    category: 'company',
    shortCode: 'Meta Facebook',
    popular: true
  },
  {
    name: 'Adobe Systems',
    city: 'San Jose / Noida / Bengaluru',
    stateOrCountry: 'Noida / Bengaluru, India',
    category: 'company',
    shortCode: 'Adobe Noida',
    popular: true
  },
  {
    name: 'Tata Consultancy Services (TCS)',
    city: 'Mumbai / Pan-India',
    stateOrCountry: 'India / Global',
    category: 'company',
    shortCode: 'TCS Tata',
    popular: true
  },
  {
    name: 'Infosys Limited',
    city: 'Bengaluru / Pune / Pan-India',
    stateOrCountry: 'India / Global',
    category: 'company',
    shortCode: 'Infosys Infy',
    popular: true
  },
  {
    name: 'Wipro Technologies',
    city: 'Bengaluru / Pan-India',
    stateOrCountry: 'India / Global',
    category: 'company',
    shortCode: 'Wipro',
    popular: true
  },
  {
    name: 'HCL Technologies',
    city: 'Noida / Pan-India',
    stateOrCountry: 'Noida / Global',
    category: 'company',
    shortCode: 'HCL Noida',
    popular: true
  },
  {
    name: 'Cognizant Technology Solutions',
    city: 'Chennai / Pan-India',
    stateOrCountry: 'India / Global',
    category: 'company',
    shortCode: 'CTS Cognizant',
    popular: true
  },
  {
    name: 'Accenture',
    city: 'Bengaluru / Gurugram / Mumbai / Pune',
    stateOrCountry: 'Global / India',
    category: 'company',
    shortCode: 'Accenture',
    popular: true
  },
  {
    name: 'Flipkart',
    city: 'Bengaluru',
    stateOrCountry: 'Karnataka, India',
    category: 'company',
    shortCode: 'Flipkart Walmart',
    popular: true
  },
  {
    name: 'Paytm (One97 Communications)',
    city: 'Noida',
    stateOrCountry: 'Uttar Pradesh, India',
    category: 'company',
    shortCode: 'Paytm Noida',
    popular: true
  }
];

/**
 * Robust Global Search Engine:
 * - Performs token-based and prefix matching across College/Univ name, City, State, Country, and Shortcodes.
 * - Handles acronyms and special patterns: "IIT", "DY Patil", "SRM", "NIT", "IIIT", "BITS", "Lucknow", "Ropar", "Mumbai", etc.
 * - Allows searching ANY location on GPS or global map.
 */
export function searchInstitutions(query: string, maxResults = 12): InstitutionSuggestion[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return INSTITUTIONS_DATABASE.slice(0, maxResults);
  }

  const q = trimmed.toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);

  const exactCityMatches: InstitutionSuggestion[] = [];
  const startsWithMatches: InstitutionSuggestion[] = [];
  const tokenMatches: InstitutionSuggestion[] = [];
  const substringMatches: InstitutionSuggestion[] = [];

  // Normalize search for acronyms e.g. "dy patil" vs "d y patil" or "d.y. patil"
  const cleanQ = q.replace(/[\.\s-]/g, '');

  for (const item of INSTITUTIONS_DATABASE) {
    const nameLower = item.name.toLowerCase();
    const cityLower = item.city.toLowerCase();
    const stateLower = item.stateOrCountry.toLowerCase();
    const codeLower = (item.shortCode || '').toLowerCase();
    const combinedText = `${nameLower} ${cityLower} ${stateLower} ${codeLower}`;
    const cleanCombined = combinedText.replace(/[\.\s-]/g, '');

    // 1. Exact or startsWith city match (e.g. typing "Lucknow", "Mumbai", "Ropar", "Noida")
    if (cityLower.startsWith(q) || cityLower.split(/[\s\/]+/).some((c) => c.startsWith(q))) {
      exactCityMatches.push(item);
    }
    // 2. Name or code starts with query (e.g. typing "IIT", "DY Patil", "SRM")
    else if (nameLower.startsWith(q) || codeLower.startsWith(q) || cleanCombined.startsWith(cleanQ)) {
      startsWithMatches.push(item);
    }
    // 3. Multi-token match (all words typed by user appear in combined info)
    else if (tokens.length > 1 && tokens.every((tok) => combinedText.includes(tok))) {
      tokenMatches.push(item);
    }
    // 4. Substring contains query or cleaned acronym
    else if (
      combinedText.includes(q) ||
      cleanCombined.includes(cleanQ) ||
      (q === 'iit' && item.category === 'iit') ||
      (q === 'nit' && item.category === 'nit') ||
      (q === 'iiit' && item.category === 'iiit')
    ) {
      substringMatches.push(item);
    }
  }

  // Remove duplicates while preserving order of relevance
  const combined = [
    ...exactCityMatches,
    ...startsWithMatches,
    ...tokenMatches,
    ...substringMatches
  ];

  const unique = Array.from(
    new Map(combined.map((item) => [item.name, item])).values()
  );

  return unique.slice(0, maxResults);
}
