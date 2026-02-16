import { VStack } from '@chakra-ui/react'
import PageContainer from '@components/PageContainer'
import ProfileSection from './components/ProfileSection'
import PasskeySection from './components/PasskeySection'
import AppearanceSection from './components/AppearanceSection'

const Settings = () => (
  <PageContainer>
    <VStack gap={{ base: 6, md: 8 }} align="stretch">
      <ProfileSection />
      <PasskeySection />
      <AppearanceSection />
    </VStack>
  </PageContainer>
)

export default Settings
