package org.cedar.onestop.api.metadata.controller

import groovy.util.logging.Slf4j
import org.cedar.onestop.api.metadata.service.MetadataManagementService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.support.RedirectAttributes

import javax.servlet.http.HttpServletResponse

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty

import static org.springframework.web.bind.annotation.RequestMethod.POST

@Slf4j
@ConditionalOnProperty("features.secure.upload")
@Controller
class UploadController {

  private MetadataManagementService metadataService

  @Autowired
  public UploadController(MetadataManagementService metadataService) {
    this.metadataService = metadataService
  }

  @GetMapping('/upload.html')
  String upload(HttpServletResponse response) {
    return 'upload'
  }

  @RequestMapping(path = '/metadata', method = POST, produces = 'application/json')
  String load(@RequestParam("files") MultipartFile[] metadataRecords, RedirectAttributes redirectAttributes) {//HttpServletResponse response) {
    log.debug("Received ${metadataRecords.length} metadata files to load")

    def results = metadataService.loadMetadata(metadataRecords)

    redirectAttributes.addFlashAttribute("data", results.data)
    return 'redirect:/uploadResponse.html'
  }

  @GetMapping('/uploadResponse.html')
  String uploadResponse() {
    return 'uploadResponse'
  }

}
