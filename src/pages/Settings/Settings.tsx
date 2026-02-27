import PageContainer from '@components/PageContainer'
import ProfileSection from './components/ProfileSection'
import PasskeySection from './components/PasskeySection'
import AppearanceSection from './components/AppearanceSection'

const Settings = () => (
  <PageContainer>
    <div className="flex flex-col gap-6 md:gap-8">
      <ProfileSection />
      <PasskeySection />
      <AppearanceSection />
    </div>
  </PageContainer>
)

export default Settings
