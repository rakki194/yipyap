### 4. Frontend Integration

#### 4.1 API Client Updates ✅

- [x] Extend the frontend API client to fetch available captioners

#### 4.2 Captioner Provider ✅

- [x] Create a provider for captioner state

#### 4.3 UI Updates ✅

- [x] Enhance the caption creation UI to use available captioners

### 5. Cross-Platform Deployment 🔄

- [ ] Create package configuration with optional dependencies
- [ ] Implement model distribution strategy
- [ ] Generate OS-specific installation guides

### 6. Testing and Fallbacks

- [x] Basic error handling in captioner plugins
- [ ] Create unit tests for each captioner plugin
- [ ] Test plugin discovery mechanism
- [ ] Test configuration validation
- [ ] Implement integration tests with mock models

### 7. Implementation Plan

1. **Phase 1**: Core Plugin Architecture ✅
   - Create plugin loader and base interfaces
   - Refactor existing JTP2 and WDv3 captioners as plugins
   - Implement captioner manager class
   - Update API endpoints to use the new system

2. **Phase 2**: Frontend Integration 🔄
   - Create captioner context provider
   - Update UI components to use available captioners
   - Add captioner configuration UI
   - Implement error handling and loading states

3. **Phase 3**: New Captioners ✅
   - Implement JoyCaptioner plugin
   - Implement Florence2 plugin
   - Create documentation for adding new plugins
   - Test with different model configurations

4. **Phase 4**: Package and Deploy 🔄
   - Define optional dependencies in package manager
   - Create installation scripts for different platforms
   - Document model download procedures
   - Provide examples of extending with custom captioners

### Bug Fixes

- [x] Fixed WDv3 generator numpy import issue
- [x] Updated captioner endpoints to use environment variables instead of global_vars

### Next Steps

- Complete comprehensive testing
- Create documentation for adding new captioner plugins
- Implement package configuration for cross-platform deployment
