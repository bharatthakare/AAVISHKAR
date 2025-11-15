
'use client';
import {
  Bot,
  FlaskConical,
  HeartPulse,
  Landmark,
  LayoutGrid,
  Leaf,
  LineChart,
  Mic,
  Newspaper,
  Satellite,
  ShieldAlert,
  Sun,
  Tractor,
  Users,
  Sprout,
  Calculator,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCard } from '@/components/dashboard-card';
import { WeatherCard } from '@/components/weather-card';
import { PageHeader } from '@/components/page-header';
import { useLanguage } from '@/hooks/use-language';


const translations = {
    en: {
        welcome: "Welcome, Farmer!",
        subtitle: "Your smart farming assistant is ready to help.",
        quickLinks: "Quick Links",
        cropTipsNews: "Crop Tips & News",
        tipOfTheDay: "Tip of the Day",
        tip: "Consider using drip irrigation to save water and reduce weed growth. It delivers water directly to the plant roots.",
        marketNews: "Market News",
        news: "Soybean prices are expected to rise in the coming weeks due to increased international demand.",
        features: [
            { title: 'Crop Advisory', description: 'Get stage-wise advice for your crops.', href: '/crop-advisory', icon: Leaf },
            { title: 'Farm Planner', description: 'Plan your sowing, irrigation, and more.', href: '/farm-planner', icon: Tractor },
            { title: 'Soil Health', description: 'Analyze soil health and get recommendations.', href: '/soil-health', icon: HeartPulse },
            { title: 'Satellite View', description: 'Monitor your farm with NDVI imagery.', href: '/satellite-view', icon: Satellite },
            { title: 'Market Prices', description: 'Track real-time mandi prices.', href: '/market-prices', icon: LineChart },
            { title: 'Pests & Diseases', description: 'Identify and manage crop threats.', href: '/pests-diseases', icon: ShieldAlert },
            { title: 'AI Tools', description: 'Access powerful AI assistants.', href: '/ai-tools', icon: Bot },
            { title: 'Community', description: 'Connect with fellow farmers.', href: '/community', icon: Users },
            { title: 'Yield Calculator', description: 'Estimate your expected crop yield.', href: '/yield-calculator', icon: Sprout },
            { title: 'Profit Calculator', description: 'Estimate your net profit from harvest.', href: '/profit-calculator', icon: Calculator },
        ]
    },
    hi: {
        welcome: "स्वागत है, किसान!",
        subtitle: "आपका स्मार्ट खेती सहायक मदद के लिए तैयार है।",
        quickLinks: "त्वरित लिंक",
        cropTipsNews: "फसल युक्तियाँ और समाचार",
        tipOfTheDay: "आज का सुझाव",
        tip: "पानी बचाने और खरपतवार की वृद्धि को कम करने के लिए ड्रिप सिंचाई का उपयोग करने पर विचार करें। यह सीधे पौधों की जड़ों तक पानी पहुंचाता है।",
        marketNews: "बाजार समाचार",
        news: "अंतरराष्ट्रीय मांग बढ़ने के कारण आने वाले हफ्तों में सोयाबीन की कीमतों में वृद्धि की उम्मीद है।",
        features: [
            { title: 'फसल सलाह', description: 'अपनी फसलों के लिए चरण-वार सलाह प्राप्त करें।', href: '/crop-advisory', icon: Leaf },
            { title: 'खेत योजनाकार', description: 'अपनी बुवाई, सिंचाई और बहुत कुछ की योजना बनाएं।', href: '/farm-planner', icon: Tractor },
            { title: 'मृदा स्वास्थ्य', description: 'मृदा स्वास्थ्य का विश्लेषण करें और सिफारिशें प्राप्त करें।', href: '/soil-health', icon: HeartPulse },
            { title: 'सैटेलाइट व्यू', description: 'एनडीवीआई इमेजरी के साथ अपने खेत की निगरानी करें।', href: '/satellite-view', icon: Satellite },
            { title: 'बाजार भाव', description: 'वास्तविक समय में मंडी की कीमतों को ट्रैक करें।', href: '/market-prices', icon: LineChart },
            { title: 'कीट और रोग', description: 'फसलों के खतरों को पहचानें और प्रबंधित करें।', href: '/pests-diseases', icon: ShieldAlert },
            { title: 'एआई उपकरण', description: 'शक्तिशाली एआई सहायकों तक पहुंचें।', href: '/ai-tools', icon: Bot },
            { title: 'समुदाय', description: ' साथी किसानों से जुड़ें।', href: '/community', icon: Users },
            { title: 'उपज कैलकुलेटर', description: 'अपनी अपेक्षित फसल उपज का अनुमान लगाएं।', href: '/yield-calculator', icon: Sprout },
            { title: 'लाभ कैलकुलेटर', description: 'कटाई से अपने शुद्ध लाभ का अनुमान लगाएं।', href: '/profit-calculator', icon: Calculator },
        ]
    },
    mr: {
        welcome: "शेतकरी, आपले स्वागत आहे!",
        subtitle: "तुमचा स्मार्ट शेती सहाय्यक मदतीसाठी तयार आहे.",
        quickLinks: "द्रुत दुवे",
        cropTipsNews: "पीक टिप्स आणि बातम्या",
        tipOfTheDay: "आजची टीप",
        tip: "पाण्याची बचत करण्यासाठी आणि तणांची वाढ कमी करण्यासाठी ठिबक सिंचनाचा वापर करण्याचा विचार करा. ते थेट वनस्पतीच्या मुळांना पाणी पोहोचवते.",
        marketNews: "बाजार बातम्या",
        news: "वाढत्या आंतरराष्ट्रीय मागणीमुळे सोयाबीनच्या दरात आगामी आठवड्यात वाढ होण्याची शक्यता आहे.",
        features: [
            { title: 'पीक सल्ला', description: 'तुमच्या पिकांसाठी टप्प्याटप्प्याने सल्ला मिळवा.', href: '/crop-advisory', icon: Leaf },
            { title: 'शेती नियोजक', description: 'पेरणी, सिंचन आणि बरेच काही योजना करा.', href: '/farm-planner', icon: Tractor },
            { title: 'जमिनीचे आरोग्य', description: 'जमिनीच्या आरोग्याचे विश्लेषण करा आणि शिफारसी मिळवा.', href: '/soil-health', icon: HeartPulse },
            { title: 'उपग्रह दृश्य', description: 'NDVI प्रतिमेसह तुमच्या शेतावर नजर ठेवा.', href: '/satellite-view', icon: Satellite },
            { title: 'बाजारभाव', description: 'वास्तविक-वेळेतील मंडीच्या किमतींचा मागोवा घ्या.', href: '/market-prices', icon: LineChart },
            { title: 'कीड आणि रोग', description: 'पिकांचे धोके ओळखा आणि व्यवस्थापित करा.', href: '/pests-diseases', icon: ShieldAlert },
            { title: 'एआय साधने', description: 'शक्तिशाली एआय सहाय्यकांमध्ये प्रवेश करा.', href: '/ai-tools', icon: Bot },
            { title: 'समुदाय', description: ' सहकारी शेतकऱ्यांशी संपर्क साधा.', href: '/community', icon: Users },
            { title: 'उत्पादन कॅल्क्युलेटर', description: 'तुमच्या अपेक्षित पीक उत्पादनाचा अंदाज लावा.', href: '/yield-calculator', icon: Sprout },
            { title: 'नफा कॅल्क्युलेटर', description: 'कापणीतून तुमच्या निव्वळ नफ्याचा अंदाज लावा.', href: '/profit-calculator', icon: Calculator },
        ]
    }
};


export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="container mx-auto p-4 md:p-8">
       <div className="relative mb-12 text-center rounded-3xl py-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200 opacity-80 -z-10"></div>
        <div className="absolute inset-0 blur-3xl" style={{background: 'radial-gradient(circle at center, hsla(142, 100%, 40%, 0.2), transparent 60%)'}}></div>
        <PageHeader
          title={t.welcome}
          subtitle={t.subtitle}
        />
      </div>

      <div className="my-8">
        <WeatherCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-8">
            <CardHeader className="px-0">
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <LayoutGrid className="text-primary" />
                {t.quickLinks}
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {t.features.map((feature) => (
                  <DashboardCard key={feature.title} {...feature} />
                ))}
            </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Newspaper className="text-primary" />
                {t.cropTipsNews}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground">
                  {t.tipOfTheDay}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t.tip}
                </p>
              </div>
              <div className="my-4 border-b border-border"></div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {t.marketNews}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t.news}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
