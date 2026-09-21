import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Badge, Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Select, SimpleGrid, Stack, Text, Textarea } from '@chakra-ui/react';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({ title: '', category: 'Engineering', description: '', status: 'Draft' });
  // eslint-disable-next-line react-hooks/purity
  const [modules, setModules] = useState([{ id: Date.now(), title: '', duration: '' }]);
  useEffect(() => {
    if (isEditMode && id === 'fs202') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({ title: 'Full Stack Development', category: 'Engineering', description: 'Master the MERN stack. Build scalable web applications.', status: 'Active' });
      setModules([{ id: 1, title: 'Frontend Foundations', duration: '2h 15m' }, { id: 2, title: 'React Single Page Apps', duration: '3h 45m' }]);
    }
  }, [id, isEditMode]);
  const handleInputChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const handleAddModule = () => setModules([...modules, { id: Date.now(), title: '', duration: '' }]);
  const handleRemoveModule = (moduleId) => { if (modules.length > 1) setModules(modules.filter(module => module.id !== moduleId)); };
  const handleModuleChange = (moduleId, field, value) => setModules(modules.map(module => module.id === moduleId ? { ...module, [field]: value } : module));
  const handleSubmit = (event) => { event.preventDefault(); console.log('Submitting Course:', { ...formData, modules }); navigate('/admin/courses'); };
  return <Container maxW="container.xl" py={10}><Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4} mb={8}><Box><Badge colorScheme="red" mb={2}>Faculty Portal</Badge><Heading size="lg">{isEditMode ? 'Edit Course' : 'Create New Course'}</Heading></Box><Button as={Link} to="/admin/courses" variant="outline">Cancel</Button></Flex><form onSubmit={handleSubmit}><SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}><Stack spacing={6} gridColumn={{ lg: 'span 2' }}><Box bg="gray.800" rounded="lg" p={6}><Heading size="sm" mb={5}>Course Information</Heading><Stack spacing={5}><FormControl isRequired><FormLabel>Course Title</FormLabel><Input name="title" value={formData.title} onChange={handleInputChange} /></FormControl><FormControl isRequired><FormLabel>Description</FormLabel><Textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} /></FormControl><SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}><FormControl><FormLabel>Category</FormLabel><Select name="category" value={formData.category} onChange={handleInputChange}><option value="Engineering">Engineering</option><option value="Science">Science</option><option value="Arts">Arts</option></Select></FormControl><FormControl><FormLabel>Status</FormLabel><Select name="status" value={formData.status} onChange={handleInputChange}><option value="Draft">Draft</option><option value="Active">Active</option></Select></FormControl></SimpleGrid></Stack></Box><Box bg="gray.800" rounded="lg" p={6}><Flex justify="space-between" align="center" mb={5}><Heading size="sm">Curriculum Modules</Heading><Button type="button" size="sm" variant="outline" onClick={handleAddModule}>Add Module</Button></Flex><Stack spacing={4}>{modules.map((module, index) => <SimpleGrid key={module.id} columns={{ base: 1, md: 12 }} spacing={3} alignItems="center" bg="gray.900" p={4} rounded="md"><Text gridColumn={{ md: 'span 1' }} textAlign="center" color="gray.400">{index + 1}</Text><Input gridColumn={{ md: 'span 6' }} placeholder="Module Title" value={module.title} onChange={(event) => handleModuleChange(module.id, 'title', event.target.value)} required /><Input gridColumn={{ md: 'span 3' }} placeholder="Duration (e.g. 2h)" value={module.duration} onChange={(event) => handleModuleChange(module.id, 'duration', event.target.value)} required /><Button type="button" gridColumn={{ md: 'span 2' }} variant="outline" colorScheme="red" onClick={() => handleRemoveModule(module.id)} isDisabled={modules.length === 1}>Remove</Button></SimpleGrid>)}</Stack></Box></Stack><Box bg="gray.800" rounded="lg" p={6} alignSelf="start" position="sticky" top="2rem"><Heading size="sm" mb={4}>Publish Settings</Heading><Text color="gray.400" fontSize="sm" mb={6}>Saving this course will immediately update the catalog. Set the status to Draft when it is not ready to publish.</Text><Button type="submit" colorScheme="red" width="full" size="lg">{isEditMode ? 'Save Changes' : 'Create Course'}</Button></Box></SimpleGrid></form></Container>;
};
export default CourseForm;
