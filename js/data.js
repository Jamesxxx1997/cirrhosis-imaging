/* ===================================================================
   肝硬化 Cirrhosis & Portal Hypertension — content data
   Source: heptabase notes (cirrhosis詳解 / Portal hypertension詳解 /
   portal hypertension 區分 etiology) + user-supplied reference images.
   =================================================================== */

const FINDINGS = [
  {
    id: 'liver_surface',
    name: '肝臟表面',
    nameEn: 'Liver Surface',
    modality: ['US', 'CT'],
    us: {
      points: [
        '結節狀表面(Nodular surface):反映再生結節與纖維隔膜,是肝硬化典型特徵',
        '微結節(Micronodular):結節 < 3mm,標準探頭難以偵測',
        '巨結節(Macronodular):結節較大,表面呈鋸齒狀或不規則線條',
        '常規腹部探頭(2-4 MHz):結節 ≥5mm 且纖維中隔 ≥0.5mm 可顯示為低回音病灶;結節 <4mm 則無法個別辨識,只會讓實質回音變得不均勻、增強且粗糙',
        '高頻探頭(5-10 MHz):解析度較高,多數 >3mm 的再生結節可清楚呈現為低回音病灶',
        '技巧:用高頻線性探頭看 inferior border of liver,可提高偵測敏感度',
        '回音特性:多數再生結節為低回音,但若結節內含明顯脂肪空泡則呈高回音 — 單靠回音高低無法可靠區分再生結節與惡性腫瘤',
        '大小參考:可見的再生結節通常較均勻,直徑約 5–10mm;發育不良結節(Dysplastic nodules)或早期 HCC 通常 >1cm,會在均勻再生結節背景中顯得突出,有助鑑別',
      ],
      images: [
        { src: 'assets/liver_surface_us.png', caption: '高頻線性探頭,沿肝下緣掃描,呈結節狀輪廓' },
      ],
    },
    ct: {
      points: [
        '肝臟輪廓呈波浪狀或結節狀,為肝硬化典型 CT 表現',
        '右後肝切跡徵(Right Posterior Hepatic Notch Sign):右肝後葉表面明顯凹陷切跡,成因是尾狀葉+左肝外側葉肥大,合併右肝後葉萎縮所共同造成的輪廓改變',
      ],
      images: [
        { src: 'assets/liver_surface_ct.png', caption: 'CT 軸切面,箭頭處可見肝表面結節狀輪廓改變' },
      ],
    },
  },
  {
    id: 'morphology',
    name: '肝臟形態體積與C/RL比值',
    nameEn: 'Morphology & Volume',
    modality: ['US', 'CT'],
    us: {
      points: [
        '右葉萎縮:體積縮小',
        '尾狀葉肥大(Caudate Lobe Hypertrophy):重要指標,常與左肝外側葉肥大同時出現',
        '實質回音(Coarse Parenchyma):肝實質回音變得粗糙(coarseness)且不均',
      ],
      images: [
        { src: 'assets/caudate_us_2.jpg', caption: '灰階超音波,肝實質回音粗糙不均' },
      ],
      quantitative: {
        title: 'C/RL ratio — 超音波量測切面',
        points: [
          '切面：橫切面 / transverse plane at the bifurcation of the main portal vein',
          '位置：porta hepatis,main portal vein 分叉成左右門靜脈附近',
          '量測：以通過主門靜脈的矢狀線分界,Caudate(C) 與 Right lobe(RL) 各取橫徑',
          '判讀：>0.65 約 96% 可能為肝硬化;>0.73 約 99% 可能為肝硬化',
        ],
        images: [
          { src: 'assets/crl_us_fig8.png', caption: 'Fig. 8. Axial slice immediately below the bifurcation of the main portal vein. A parasagittal line through the right lateral border of the portal vein and a second through the left lateral border of the caudate lobe define C and RL on an orthogonal line drawn to the right liver edge. Ratio = 43.1/92.0 = 0.47 — noncirrhotic by threshold, yet this patient had cirrhosis, illustrating high specificity but lower sensitivity.' },
          { src: 'assets/crl_us_fig8_1.png', caption: 'Fig. 8.1. Caudate lobe hypertrophy with right lobe hypotrophy. C/RL = 68.9/83.7 = 0.82, consistent with chronic liver disease / cirrhosis.' },
        ],
        ref: { label: 'Makuuchi et al. Radiology 1987;165(2):289–93', url: 'https://pubmed.ncbi.nlm.nih.gov/3532188/' },
      },
    },
    ct: {
      points: [
        '葉體積重新分佈(Lobar Redistribution)',
        '早期肥大:常見於尾狀葉(Segment I)與左肝外側葉(Segments II, III)',
        '晚期萎縮:常見於右肝後葉(Segments VI, VII)與左肝內側葉(Segment IV)',
        '膽囊窩擴大(Expanded gallbladder fossa):因肝萎縮,周圍空間增加並被脂肪填滿',
      ],
      quantitative: {
        title: 'C/RL ratio(Caudate-Right Lobe Ratio)— 量化尾狀葉肥大',
        points: [
          'Image level:主門靜脈分叉處正下方的軸切面',
          'Line 1:通過主門靜脈右側緣的矢狀線',
          'Line 2:通過尾狀葉左側緣的矢狀線',
          'Line 3:與 Line 1、Line 2 垂直,位於主門靜脈與下腔靜脈中點,延伸至右肝緣',
          'Caudate(C):沿 Line 3,Line 1 與 Line 2 之間的距離',
          'Right lobe(RL):沿 Line 3,右肝緣到 Line 1 的距離',
          'C/RL ratio = C / RL',
          '判讀: <0.6 正常(不能排除肝硬化) ・ 0.6–0.65 borderline ・ >0.65 約 96% 可能為肝硬化 ・ >0.73 約 99% 可能為肝硬化',
        ],
        image: { src: 'assets/crl_ratio_ct.png', caption: 'C/RL ratio 量測示意:Line 1/2/3 與 caudate(C)、right lobe(RL)量測位置' },
      },
    },
  },
  {
    id: 'splenomegaly',
    name: 'Splenomegaly',
    nameEn: 'Splenomegaly',
    modality: ['US', 'CT'],
    us: {
      points: [
        '脾臟長徑 >13cm,為門脈高壓的標誌之一',
        '量測方式:longitudinal coronal oblique view,取 superomedial 到 inferolateral 的最大長徑',
        '2023 年 Kurdish 健康成人研究(n=300,已排除感染/肝硬化/portal HTN/血液疾病):平均脾長 10.68±1.28cm,87% ≤12cm,97% ≤13cm,最大 14.1cm',
        '文獻回顧:不同研究的 adult upper limit 落在 12–14cm 之間;13cm 是較實用的切點,但 12cm 以上不一定病態(尤其男性/高個子)',
      ],
      images: [
        { src: 'assets/splenomegaly_us.jpg', caption: '脾臟長徑量測,本例 Length of Spleen = 17.6cm(明確脾腫大)' },
      ],
    },
    ct: {
      points: [
        '門脈高壓常見徵象,CT 上同樣以長徑評估',
        'Gamna-Gandy bodies:脾臟內含鐵結節,CT 上可能表現為鈣化或高密度點,反映陳舊性脾內微出血',
      ],
      images: [
        { src: 'assets/splenomegaly_ct.webp', caption: 'CT 冠狀面,黃線為脾臟最大徑量測,本例 24cm(嚴重脾腫大)' },
      ],
    },
  },
  {
    id: 'hepatomegaly',
    name: 'Hepatomegaly',
    nameEn: 'Hepatomegaly',
    modality: ['US', 'CT'],
    us: {
      points: [
        'Craniocaudal length < 15–16cm',
        'Anteroposterior diameter < 13cm',
        '量測方式(convex probe,病人 supine,右肋間/肋下掃描):探頭置於 right midclavicular line,sagittal/longitudinal plane;畫面同時納入 right hemidiaphragm/hepatic dome(上)與 inferior liver tip(下);用 caliper 量 craniocaudal length 或 AP 徑',
        '若右葉放不進畫面,使用 panoramic / large field of view,或報告「measurement limited」',
      ],
      images: [
        { src: 'assets/hepatomegaly_us_cc.png', caption: 'MCL 最大 craniocaudal 徑量測(吸氣末,supine):自後橫膈到肝下緣最大長徑(Kratzer 2003, N=2080;Patzak 2014, N=1789,Germany)' },
        { src: 'assets/hepatomegaly_us_ap.png', caption: 'MCL 最大 anteroposterior 徑量測:本研究平均 11.33±1.42cm,正常上限定義為 13±0.5cm(Childs 2014;DEGUM)' },
      ],
    },
    ct: {
      points: [
        'Volume index (CT) = (CTmaxML × CTmaxDV × CTmaxCC) / 3.6 (cm³ / mL)',
        'Upper limit = 14.0 × 體重(kg) + 979 mL',
        '量測原則:找「最大外徑」而非固定解剖標記',
        '三軸務必正交(orthogonal):水平左右向(mediolateral)、垂直上下向(craniocaudal)、前後向(dorsoventral)分別拉,不要斜著沿肝臟形狀量測',
      ],
      images: [
        { src: 'assets/hepatomegaly_ct.png', caption: '三軸量測示意:mediolateral / craniocaudal(panel A)、dorsoventral(panel B)' },
      ],
    },
  },
  {
    id: 'ascites',
    name: '腹水',
    nameEn: 'Ascites',
    modality: ['US', 'CT'],
    us: {
      points: [
        '超音波對腹水非常敏感,可偵測到微量腹水',
        '常見好發位置:骨盆腔(Pouch of Douglas/Morison 氏陷凹)、肝周、脾周',
      ],
      images: [
        { src: 'assets/ascites_us.jpg', caption: '骨盆腔縱切,箭頭處為少量游離液體(minimal ascites)' },
      ],
    },
    ct: {
      points: [
        '腹腔內液體積聚,CT 上呈水樣低密度,沿腹膜腔重力依賴部位分布',
        '常合併腸繫膜水腫(Misty mesentery)、腸壁與膽囊壁增厚',
      ],
      images: [
        { src: 'assets/ascites_ct.webp', caption: 'CT 軸切面,箭頭處為骨盆腔(A)與肝/脾周(B)少量腹水' },
      ],
    },
  },
  {
    id: 'gb_wall',
    name: '膽囊壁增厚',
    nameEn: 'Gallbladder Wall Thickening',
    modality: ['US', 'CT'],
    us: {
      points: [
        '常見於肝硬化合併腹水的患者',
        '機轉:低蛋白血症(膠體滲透壓下降)及靜脈/淋巴回流壓力升高',
      ],
      images: [
        { src: 'assets/gb_wall_us.png', caption: '膽囊壁瀰漫性增厚' },
      ],
    },
    ct: {
      points: [
        '瀰漫性膽囊壁增厚,常合併 pericholecystic fluid(膽囊周圍積液)',
        '為非特異性表現,須與急性膽囊炎等鑑別,但在肝硬化合併腹水/低蛋白血症的臨床背景下相當常見',
      ],
      images: [
        { src: 'assets/gb_wall_ct.png', caption: 'CT 軸切面,箭頭處為增厚的膽囊壁' },
      ],
    },
  },
  {
    id: 'paraumbilical_vein',
    name: 'Recanalized Paraumbilical Vein',
    nameEn: 'Paraumbilical Vein Recanalization',
    modality: ['US', 'CT'],
    us: {
      points: [
        '位置:ligamentum teres(肝圓韌帶)走行處',
        '門脈高壓時臍旁靜脈再通(recanalization),血流經由此路徑分流至體循環,走向肚臍形成側支',
        'Doppler 可直接顯示血流訊號,確認其再通而非單純纖維索狀結構',
      ],
      images: [
        { src: 'assets/paraumbilical_us_1.png', caption: 'Color Doppler:ligamentum teres 處可見再通血管之血流訊號' },
        { src: 'assets/paraumbilical_us_2.jpeg', caption: '另一案例:臍旁靜脈再通,Doppler 血流訊號' },
      ],
    },
    ct: {
      points: [
        'Contrast enhancement of the paraumbilical vein 為門脈高壓的病理性特徵(pathognomonic)',
        '走向肚臍,嚴重時形成腹壁側支網(臨床對應 caput medusae / 海蛇頭徵)',
      ],
      images: [
        { src: 'assets/paraumbilical_ct.jpeg', caption: '顯影 CT,可見再通的臍旁靜脈呈強化管狀結構,沿 ligamentum teres 走向腹壁' },
        { src: 'assets/paraumbilical_ct_bonus.png', caption: '另一案例:顯影 CT(PVP)顯示再通的臍旁靜脈內充滿顯影劑,自左門靜脈分出(箭頭)' },
      ],
    },
  },
  {
    id: 'varices',
    name: 'Varices',
    nameEn: 'Portosystemic Varices',
    modality: ['US', 'CT'],
    us: {
      points: [
        'Gastro-esophageal junction varices:胃食道交接處可見扭曲擴張血管',
        'Splenic vein varices(dilated and tortuous):脾門(splenic hilum)處扭曲擴張的側支血管',
      ],
      images: [
        { src: 'assets/varices_us_ge.png', caption: 'Gastro-esophageal junction 處側支血管' },
        { src: 'assets/varices_us_splenic_hilum.png', caption: '脾門處扭曲擴張的側支血管(splenic vein varices)' },
      ],
    },
    ct: {
      points: [
        '顯影 CT 於食道周圍/胃食道交接處可見結節狀、扭曲增粗的側支血管',
        '胃左靜脈(Left gastric / coronary vein)直徑 > 5–6mm 提示門脈高壓,此靜脈供應食道與胃底靜脈曲張',
      ],
      images: [
        { src: 'assets/varices_ct.jpeg', caption: 'CT 軸切面,箭頭處為食道旁側支血管(esophageal varix)' },
        { src: 'assets/varices_ct_left_gastric.png', caption: 'Afferent pathways:胃左靜脈(Left Gastric Vein,即 coronary vein)、Short gastric vein、Posterior gastric veins 供應食道與胃底靜脈曲張' },
        { src: 'assets/varices_ct_gastric_3d.png', caption: 'Portal venous phase CT(a)與 3D 重組(b):胃靜脈曲張(arrowhead)合併 short gastric vein(實線箭頭)與 coronary vein/胃左靜脈(虛線箭頭)擴張。St=stomach,Spl=accessory spleen' },
      ],
    },
  },
  {
    id: 'portal_vein',
    name: 'Portal Vein',
    nameEn: 'Portal Vein',
    modality: ['US', 'CT'],
    us: {
      normal: {
        points: [
          '管徑 < 13mm',
          'Mean velocity 約 15–30 cm/s',
          '血流方向:hepatopetal(入肝),受呼吸輕微調節',
          '量測方式:B-mode 下量測兩內壁間管徑,最佳位置在與肝動脈交叉處或稍下游',
        ],
        images: [
          { src: 'assets/pv_measure_location.png', caption: '門靜脈管徑量測位置:B-mode 兩內壁間,肝動脈交叉處附近' },
          { src: 'assets/pv_hepatopetal.jpg', caption: 'Hepatopetal flow(入肝,正常)。注意:Color Doppler 紅/藍取決於機器 color map 與探頭方向,不能背成「紅一定入肝」,需配合 spectral Doppler 判讀血流方向' },
        ],
      },
      abnormal: {
        points: [
          '管徑擴張:> 13mm',
          '血流方向:Hepatofugal flow(離肝)',
          'Collateral vessels:肝門處可見扭曲擴張的側支血管(詳見 Varices 卡片)',
          'Portal vein thrombosis(PVT):管腔內可見血栓,Doppler 該處無血流訊號',
        ],
        images: [
          { src: 'assets/pv_hepatofugal.jpg', caption: 'Hepatofugal flow(離肝),門脈高壓警訊' },
          { src: 'assets/pv_thrombosis_us.png', caption: 'Portal vein thrombosis:Color Doppler 血栓處無血流訊號' },
        ],
      },
    },
    ct: {
      points: [
        'PVT 診斷需在 portal venous phase 顯影 CT 上確認:門靜脈及其分支部分或完全未顯影(non-opacification / filling defect)',
        '慢性血栓可形成 cavernous transformation(海綿狀血管瘤樣變性):肝門處多條側支血管',
        '若管腔內軟組織有強化,提示為腫瘤栓塞(tumor thrombus)而非單純血栓',
      ],
      images: [
        { src: 'assets/pv_thrombosis_ct.png', caption: '顯影 CT,門靜脈內充盈缺損(filling defect),診斷 portal vein thrombosis' },
      ],
    },
  },
  {
    id: 'hepatic_vein',
    name: 'Hepatic Vein',
    nameEn: 'Hepatic Vein',
    modality: ['US'],
    us: {
      normal: {
        points: [
          'B-mode:探頭與血管垂直時,正常肝靜脈壁呈纖細、明亮、平滑的回音線',
          'Doppler:受心臟週期影響呈三相波(Triphasic),mean velocity 約 5–6 cm/s',
        ],
        images: [
          { src: 'assets/hv_wall_diagram.png', caption: 'Panel A:正常肝靜脈壁,纖細平滑明亮回音線;Panel B/C:異常表現對照(見右側)' },
        ],
      },
      abnormal: {
        points: [
          'B-mode:管壁失去連續性與均勻的回音亮度/厚度(loss of continuity and uniformity),且失去平滑外觀,管壁呈波浪狀(wavy wall)',
          'B-mode:管徑可沿走行出現不規則起伏(diameter fluctuation)',
          'Doppler:因再生結節壓迫及肝實質順應性下降,波形變平(dampening),呈單相波(Monophasic)或雙相波',
        ],
        images: [
          { src: 'assets/hv_abnormal.png', caption: 'Diameter fluctuations of hepatic veins:管徑沿走行呈不規則起伏' },
        ],
      },
    },
    ct: null,
  },
  {
    id: 'splenic_vein',
    name: 'Splenic Vein',
    nameEn: 'Splenic Vein',
    modality: ['US', 'CT'],
    us: {
      normal: {
        points: ['B-mode 管徑 cut-off:≥10–11mm 視為擴張'],
        images: [
          { src: 'assets/sv_normal.png', caption: '脾靜脈解剖位置示意:胰臟後方,匯入門靜脈處(無擴張)' },
        ],
      },
      abnormal: {
        points: [
          '管徑擴張(≥10–11mm):反映門脈高壓側支壓力上升',
          'Splenic vein thrombosis:完全血栓時該處 Color Doppler 無血流訊號;部分血栓則可見殘餘血流訊號。確診仍需 portal venous phase 顯影檢查(完全或部分未顯影)',
        ],
        images: [
          { src: 'assets/sv_dilated.png', caption: '擴張的脾靜脈,本例 color Doppler 量得管徑 D=15.6mm' },
          { src: 'assets/sv_thrombosis_us.png', caption: '部分血栓(partial thrombosis),Color Doppler 仍可見殘餘血流訊號' },
        ],
      },
    },
    ct: {
      points: [
        '確診需在 portal venous phase 顯影 CT 上確認:脾靜脈完全或部分未顯影(non-opacification)',
      ],
      images: [
        { src: 'assets/sv_thrombosis_ct.png', caption: '顯影 CT,脾靜脈未顯影,診斷 splenic vein thrombosis' },
      ],
    },
  },
];

/* ---------------------------------------------------------------
   Portal HTN: Cardiac (congestive hepatopathy) vs. Liver cirrhosis
   --------------------------------------------------------------- */
const CARDIAC_VS_LIVER = {
  title: '門脈高壓的鑑別:心因性(Congestive Hepatopathy) vs. 肝因性(Cirrhosis)',
  intro: '門脈高壓的超音波徵象(脾腫大、腹水、PV 管徑擴張等)在肝硬化與右心衰竭引起的鬱血性肝病中高度重疊。下列幾項是較有鑑別力的切入點。',
  rows: [
    {
      feature: '病理機制',
      cirrhosis: '肝實質纖維化導致血管受壓,阻力增加',
      congestive: '右心衰竭導致下腔靜脈壓力傳導至肝臟,造成血管擴張',
    },
    {
      feature: 'IVC(B-mode)',
      cirrhosis: '管徑通常正常或受壓,吸氣時可塌陷',
      congestive: '明顯擴張(> 2cm),吸氣時無塌陷或塌陷幅度 < 40%',
    },
    {
      feature: 'HV(B-mode,測量點:距匯入 IVC 前 1–2cm)',
      cirrhosis: '管徑變細 / 受壓',
      congestive: '管徑擴張(> 1cm)',
    },
    {
      feature: 'HV waveform(Doppler)',
      cirrhosis: '相位性減少(decreased phasicity),呈單相(monophasic)或平坦波形,失去心跳波動',
      congestive: '搏動性增加,a 波與 v 波明顯增高;若合併三尖瓣逆流,S 波會變淺或逆轉',
    },
    {
      feature: 'PV waveform(Doppler)',
      cirrhosis: 'Hepatofugal flow',
      congestive: '搏動性增加,波形隨心跳出現明顯波峰與波谷,通常仍為順行血流',
    },
  ],
};

/* ---------------------------------------------------------------
   Non-invasive fibrosis assessment / calculators
   --------------------------------------------------------------- */
const CALCULATORS = {
  fib4: {
    name: 'FIB-4 Index',
    summary: '結合年齡、AST、ALT、血小板,適合初步篩檢,在 NAFLD/MASLD 患者預測晚期纖維化的表現優於其他血清標記(c-statistic 0.80)',
    formula: 'FIB-4 = (Age × AST) / (Platelet count [10⁹/L] × √ALT)',
    inputs: [
      { id: 'age', label: 'Age', unit: 'years' },
      { id: 'ast', label: 'AST', unit: 'U/L' },
      { id: 'alt', label: 'ALT', unit: 'U/L' },
      { id: 'plt', label: 'Platelet', unit: '10⁹/L' },
    ],
    cutoffs: [
      { range: '≤ 1.30', label: '低風險(Rule out)', detail: 'NPV 90%' },
      { range: '1.30 (不含) – 2.67 (不含)', label: '中間,無法排除也無法確診', detail: '' },
      { range: '≥ 2.67', label: '高風險(Rule in)', detail: 'PPV 80%' },
    ],
  },
  apri: {
    name: 'APRI(AST to Platelet Ratio Index)',
    summary: 'AST 與血小板比值,計算簡單',
    formula: 'APRI = [(AST / AST 正常上限 ULN) × 100] / Platelet count [10⁹/L]',
    inputs: [
      { id: 'ast', label: 'AST', unit: 'U/L' },
      { id: 'astUln', label: 'AST 正常上限(ULN,請依所在實驗室數值調整,40 為常見預設)', unit: 'U/L', default: 40 },
      { id: 'plt', label: 'Platelet', unit: '10⁹/L' },
    ],
    cutoffs: [
      { range: '切點 0.7', label: '預測顯著纖維化(Significant fibrosis, F2-F4)', detail: '敏感度 77%,特異度 72%' },
      { range: '切點 1.0', label: '預測肝硬化(Cirrhosis, F4)', detail: '敏感度 76%,特異度 72%' },
    ],
  },
  fibrotest: {
    name: 'FibroTest',
    summary: '專利演算法,結合 5 個血清標記(Alpha-2-macroglobulin、Apolipoprotein A1、Haptoglobin、Gamma-glutamyl transferase、Total bilirubin)再加上年齡與性別,計算出綜合分數',
    formula: '演算法未公開(proprietary),故本頁僅提供參考說明,不提供計算器',
    cutoffs: [
      { range: '預測顯著纖維化', label: '敏感度約 60–75%,特異度約 80–90%', detail: '' },
      { range: '限制', label: '約有高達 50% 的結果落入「未定(Indeterminate)」區間,無法明確分類', detail: '' },
    ],
  },
  childPugh: {
    name: 'Child-Pugh Classification',
    summary: '以五項臨床/檢驗指標評估肝硬化嚴重度與預後',
    inputs: [
      {
        id: 'bilirubin', label: 'Total Bilirubin (mg/dL)', type: 'select',
        options: [
          { value: 1, label: '< 2' },
          { value: 2, label: '2 – 3' },
          { value: 3, label: '> 3' },
        ],
      },
      {
        id: 'albumin', label: 'Albumin (g/dL)', type: 'select',
        options: [
          { value: 1, label: '> 3.5' },
          { value: 2, label: '2.8 – 3.5' },
          { value: 3, label: '< 2.8' },
        ],
      },
      {
        id: 'inr', label: 'INR', type: 'select',
        options: [
          { value: 1, label: '< 1.7' },
          { value: 2, label: '1.7 – 2.3' },
          { value: 3, label: '> 2.3' },
        ],
      },
      {
        id: 'ascites', label: 'Ascites', type: 'select',
        options: [
          { value: 1, label: '無' },
          { value: 2, label: '輕度,藥物可控制' },
          { value: 3, label: '中重度,藥物難控制' },
        ],
      },
      {
        id: 'encephalopathy', label: 'Hepatic Encephalopathy', type: 'select',
        options: [
          { value: 1, label: '無' },
          { value: 2, label: 'Grade 1–2' },
          { value: 3, label: 'Grade 3–4' },
        ],
      },
    ],
    classes: [
      { range: '5 – 6 分', cls: 'Class A', detail: '通常對應代償性肝硬化(well-compensated),一年存活率約 100%' },
      { range: '7 – 9 分', cls: 'Class B', detail: '功能顯著受損(significant functional compromise),一年存活率約 80%' },
      { range: '10 – 15 分', cls: 'Class C', detail: '通常對應失代償性肝硬化(decompensated),一年存活率約 45%' },
    ],
    encephalopathyGrades: [
      { level: 'Grade 1', name: '混亂 Confusion', detail: '個性改變、答非所問、日夜顛倒' },
      { level: 'Grade 2', name: '嗜睡 Lethargy', detail: '說話判斷力差,手及身體不自覺顫抖' },
      { level: 'Grade 3', name: '半昏迷 Stupor', detail: '大部分時間都在睡眠的狀態,但可以叫醒' },
      { level: 'Grade 4', name: '昏迷 Coma', detail: '叫不醒' },
    ],
  },
};

/* ---------------------------------------------------------------
   Prognosis: compensated vs. decompensated + Child-Pugh overview
   --------------------------------------------------------------- */
const PROGNOSIS = {
  compensated: {
    title: '代償性肝硬化 Compensated Cirrhosis',
    points: [
      '定義:經組織學或影像學證實有肝硬化,但尚未出現主要併發症',
      '中位數存活期通常 > 12 年',
      '即使已有食道靜脈曲張,只要沒有出血,臨床上仍歸類為代償性 — 但預後比完全沒有靜脈曲張者差(一年死亡率 3.4% vs 1.0%)',
    ],
  },
  decompensated: {
    title: '失代償性肝硬化 Decompensated Cirrhosis',
    points: [
      '定義:出現以下任一主要併發症,即進入失代償期',
      '靜脈曲張出血(Variceal hemorrhage)',
      '腹水(Ascites)— 最常見的併發症',
      '肝性腦病變(Hepatic encephalopathy)',
      '黃疸(Jaundice)',
      '自發性細菌性腹膜炎(SBP)',
      '肝腎症候群(Hepatorenal syndrome)',
      '肝肺症候群(Hepatopulmonary syndrome)',
      '肝細胞癌(HCC)— 部分文獻列為失代償定義之一',
      '預後:若 Child-Pugh ≥12 分或 MELD ≥21,中位數存活期可能 ≤6 個月',
    ],
  },
  guidelines: [
    {
      name: 'Baveno VII',
      points: [
        '定義較嚴格,強調「明顯(Overt)」的臨床事件',
        '失代償事件:明顯腹水(或 SAAG 升高之胸水)、明顯肝腦病變(West Haven > II 級)、靜脈曲張出血',
        '灰色地帶:單純黃疸是否應視為首次失代償事件,目前證據不足',
        '不視為失代償:僅影像學發現的微量腹水、輕微肝腦病變、門脈高壓性胃病引起的隱性出血',
      ],
    },
    {
      name: 'EASL',
      points: [
        '定義較廣泛,視為臨床表型的轉變',
        '主要定義事件:腹水、出血、腦病變,以及黃疸',
        '與 Baveno VII 不同之處:明確將黃疸列為失代償的主要標誌之一',
      ],
    },
  ],
};

/* ---------------------------------------------------------------
   Treatment
   --------------------------------------------------------------- */
const TREATMENT = [
  {
    id: 'ascites',
    title: '腹水(Ascites)初始治療',
    points: [
      '治療目標:造成負鈉平衡(negative sodium balance)',
      '限鈉飲食:每日鈉攝取限制在 2000 mg(88 mEq)以內,並進行營養諮詢',
      '限水:通常不需要,除非血鈉 < 120–125 mEq/L',
      '避免使用:NSAIDs(減少尿鈉排泄、可致腎衰竭)、ACEIs/ARBs(降低血壓、影響腎灌流)',
      '利尿劑首選:Spironolactone(抗醛固酮)+ Furosemide(環利尿劑),起始比例 100mg : 40mg 以維持鉀離子平衡',
      '劑量調整:每 3–5 天調整一次,最大劑量 Spironolactone 400mg / Furosemide 160mg',
      '體重監測:無水腫者每日減重不超過 0.5kg,有水腫者不超過 1kg',
      '大量腹水穿刺(LVP):若引起症狀或張力過大應穿刺;抽取量 > 5L 時,應補充白蛋白(每公升腹水 6–8g)以預防循環功能障礙',
    ],
  },
  {
    id: 'varices_prophylaxis',
    title: '食道靜脈曲張一級預防',
    points: [
      '目標:預防首次出血',
      '篩檢適應症:所有失代償性肝硬化患者;代償性肝硬化且 LSM > 20 kPa 或血小板 < 150,000/µL 者',
      'Baveno VI 標準:代償性肝硬化若 LSM < 20 kPa 且血小板 > 150,000/µL,可暫免內視鏡篩檢',
      '高風險靜脈曲張定義:大型曲張,或小型曲張合併紅色徵象(red signs),或病人已處於失代償狀態',
      'NSBB 首選:Carvedilol(代償性肝硬化首選,降低門脈壓力效果優於傳統 NSBB),起始劑量 3.125mg BID',
      'NSBB 替代:Nadolol / Propranolol(常用於失代償性肝硬化),目標心率 55–60 bpm,收縮壓需維持 > 90 mmHg',
      '替代方案:內視鏡靜脈曲張結紮術(EVL),適用於無法耐受或有禁忌症的患者',
      '禁忌:低血壓(MAP ≤ 82 mmHg)、急性腎損傷或自發性細菌性腹膜炎患者不應使用 Beta 阻斷劑',
    ],
  },
  {
    id: 'other_complications',
    title: '其他併發症概覽',
    points: [
      '自發性細菌性腹膜炎(SBP):腹水感染,診斷標準為腹水 PMN ≥ 250 cells/µL,需抗生素治療',
      '肝腎症候群(Hepatorenal Syndrome):嚴重肝病及腹水患者的功能性腎衰竭,診斷需先排除其他腎損傷原因',
      '肝性腦病變(Hepatic Encephalopathy):可逆的神經精神異常;治療包括處理誘發因子(感染、出血、便秘)、使用 Lactulose 與 Rifaximin',
      '肝細胞癌(HCC):肝硬化患者需定期接受超音波與 AFP 篩檢',
      '門靜脈血栓(PVT):可能加重門脈高壓',
    ],
  },
  {
    id: 'hyponatremia',
    title: '低血鈉(Hyponatremia)處置',
    points: [
      '停用降壓藥物:平均動脈壓降至 82 mmHg 或更低時,應停用乙型/甲型阻斷劑、利尿劑(尤其噻嗪類)',
      '校正低血鉀:補鉀有助於提升血鈉,同時降低肝性腦病變風險',
      '若停藥後仍持續低血壓,可用 Midodrine 將 MAP 維持在 82 mmHg 以上',
      '校正速度務必控制:每日血鈉提升不應超過 4–6 mEq/L,以免引發滲透壓性去髓鞘症候群(ODS)',
      '若出現嚴重症狀且血鈉 < 120 mEq/L,或預計在幾天內接受肝臟移植且血鈉 < 125 mEq/L:可考慮輸注白蛋白,或高張食鹽水(視情況搭配 loop diuretics / 腹腔穿刺放液以防水分過負荷)',
      '應避免:限水(實際執行困難且缺乏療效證據);血管加壓素受體拮抗劑(如 Tolvaptan,FDA 警告可能引發肝衰竭或死亡,除即將肝移植病人短期使用外應避免)',
    ],
  },
  {
    id: 'general',
    title: '一般管理',
    points: [
      '治療潛在病因:如抗病毒治療(HCV 治癒可降低死亡率)、戒酒',
      '疫苗接種:A 型肝炎、B 型肝炎、流感、肺炎鏈球菌、COVID-19',
      '避免肝毒性物質:酒精、高劑量乙醯胺酚、NSAIDs、草藥',
      '藥物調整:注意藥物在肝硬化患者中的代謝變化',
      '轉診時機:MELD 分數 ≥ 10 或出現失代償症狀時,應考慮轉診至移植中心評估',
    ],
  },
];
