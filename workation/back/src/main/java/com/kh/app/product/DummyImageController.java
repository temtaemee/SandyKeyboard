package com.kh.app.product;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/public/product/dummy-images")
public class DummyImageController {

    static final Path IMAGE_ROOT = Path.of("D:/dev/finalPrj/.claude/resource/image").toAbsolutePath().normalize();

    @GetMapping("/**")
    public ResponseEntity<Resource> getImage(HttpServletRequest request) throws Exception {
        String prefix = "/api/public/product/dummy-images/";
        String uri = request.getRequestURI();
        String encodedPath = uri.substring(uri.indexOf(prefix) + prefix.length());
        String decodedPath = URLDecoder.decode(encodedPath, StandardCharsets.UTF_8);

        Path imagePath = IMAGE_ROOT.resolve(decodedPath).normalize();
        if (!imagePath.startsWith(IMAGE_ROOT) || !Files.isRegularFile(imagePath)) {
            return ResponseEntity.notFound().build();
        }

        String contentType = Files.probeContentType(imagePath);
        MediaType mediaType = contentType == null
                ? MediaType.APPLICATION_OCTET_STREAM
                : MediaType.parseMediaType(contentType);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .body(new UrlResource(imagePath.toUri()));
    }
}
