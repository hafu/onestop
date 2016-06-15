package ncei.onestop.api

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.SpringApplicationConfiguration
import org.springframework.boot.test.WebIntegrationTest
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.RequestEntity
import org.springframework.web.client.RestTemplate
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
@WebIntegrationTest(randomPort = true)
@SpringApplicationConfiguration(classes = Application)
class SearchApiIntegrationSpec extends Specification {
    @Value('${local.server.port}')
    String port

    @Value('${server.context-path}')
    String contextPath

    static MediaType contentType = MediaType.APPLICATION_JSON_UTF8

    RestTemplate restTemplate
    URI searchBaseUri

    void setup() {
        restTemplate = new RestTemplate()
        restTemplate.errorHandler = new TestResponseErrorHandler()

        searchBaseUri = "http://localhost:${port}/${contextPath}/search".toURI()
    }


    def notexistingwordsearch = """\
{
  "queries": [
    {"type": "queryText", "value": "spork"}
  ]
}"""

    def baresearch = """\
{
  "queries": [
    {"type": "queryText", "value": "temperature"}
  ]
}"""
    def strangecharjsonsearch = """\
{
  "queries": [
    {"type": "queryText", "value": "~"}
  ]
}"""

    def blankjsonsearch = """\
{
  "queries": [
    {"type": "queryText", "value": ""}
  ]
}"""

    def badjsonsearch = """\
{
  "queries": [
     {"type": "queryText", "value": "}
  ]
}"""

    def invalidschemarequest = """\
{
  "filters": [
    {"type": "point", "value": "temperature"},
    {"type": "dateTime", "before": "YYYY-MM-DD", "after": "YYYY-MM-DD"}
  ]
}"""

    def searchqueriesfiltersformatting = """\
{
  "queries": [
    {"type": "queryText", "value": "temperature"}
  ],
  "filters":[
    {"type": "facet", "name": "apiso_TopicCategory_s", "values": ["oceanography", "oceans"]},
    {"type": "datetime", "before": "2016-06-15T20:20:58Z", "after": "2015-09-22T10:30:06.000Z"}
  ],
  "sort": "relevance",
  "page": {"number": 1, "size": 10}
}"""

    // -------- Test Cases --------
    def 'valid search returns ok and results'() {
        def requestEntity = RequestEntity
                .post(searchBaseUri)
                .contentType(contentType)
                .body(baresearch)

        when:
        def result = restTemplate.exchange(requestEntity, Map)

        then: "Search ok"
        result.statusCode == HttpStatus.OK
        result.headers.getContentType() == contentType
        and: "result contains > 0 items"
        def items = result.body.data
        items
        items.size() > 0
        and: "each item has id, type, and attributes"
        items.every { item ->
            item.id instanceof String &&
              item.type instanceof String &&
              item.attributes instanceof Map
        }
    }

    def 'invalid search returns errors when not conforming to schema'() {
        def requestEntity = RequestEntity
                .post(searchBaseUri)
                .contentType(contentType)
                .body(invalidschemarequest)

        when:
        def result = restTemplate.exchange(requestEntity, Map)

        then: "Request invalid"
        result.statusCode == HttpStatus.BAD_REQUEST

        and: "result contains errors list"
        result.body.errors instanceof List
        result.body.errors.every { it.status == '400'}
        result.body.errors.every { it.detail instanceof String }
    }

    def 'valid search returns ok and 0 results when queryText is strange character'() {
        def requestEntity = RequestEntity
                .post(searchBaseUri)
                .contentType(contentType)
                .body(strangecharjsonsearch)

        when:
        def result = restTemplate.exchange(requestEntity, Map)

        then: "Search ok"
        result.statusCode == HttpStatus.OK
        result.headers.getContentType() == contentType
        and: "result contains == 0 items"
        def items = result.body.data
        items == []
    }

    def 'valid search returns ok and 0 results when queryText is non existing word'() {
        def requestEntity = RequestEntity
                .post(searchBaseUri)
                .contentType(contentType)
                .body(notexistingwordsearch)

        when:
        def result = restTemplate.exchange(requestEntity, Map)

        then: "Search ok"
        result.statusCode == HttpStatus.OK
        result.headers.getContentType() == contentType
        and: "result contains == 0 items"
        def items = result.body.data
        items == []
    }

    def 'valid search returns ok and 0 results when queryText is blank'() {
        def requestEntity = RequestEntity
                .post(searchBaseUri)
                .contentType(contentType)
                .body(blankjsonsearch)

        when:
        def result = restTemplate.exchange(requestEntity, Map)

        then: "Search ok"
        result.statusCode == HttpStatus.OK
        result.headers.getContentType() == contentType
        and: "result contains == 0 items"
        def items = result.body.data
        items == []
    }

    def 'invalid search returns returns error, json body not parseable'() {
        def requestEntity = RequestEntity
                .post(searchBaseUri)
                .contentType(contentType)
                .body(badjsonsearch)

        when:
        def result = restTemplate.exchange(requestEntity, Map)

        then: "Bad request"
        result.statusCode == HttpStatus.BAD_REQUEST
        result.headers.getContentType() == contentType
        and: "result contains no items"
        result.body.data == null
        String error = result.body.error
        error.contains("Bad Request")
    }

    def 'invalid search returns returns error, need to specify body is json content type'() {
        def requestEntity = RequestEntity
                .post(searchBaseUri)
                .body(baresearch)

        when:
        def result = restTemplate.exchange(requestEntity, Map)

        then: "Bad request"
        result.statusCode == HttpStatus.UNSUPPORTED_MEDIA_TYPE
        result.headers.getContentType() == contentType
        and: "result contains no items"
        result.body.data == null
    }

    def 'invalid search returns returns error, need to specify json body'() {
        def requestEntity = RequestEntity
                .post(searchBaseUri)
                .contentType(contentType)
                .body("")

        when:
        def result = restTemplate.exchange(requestEntity, Map)

        then: "Bad request"
        result.statusCode == HttpStatus.BAD_REQUEST
        result.headers.getContentType() == contentType
        and: "result contains no items"
        result.body.data == null
    }

    def 'valid search returns ok and results, if json is empty'() {
        def requestEntity = RequestEntity
                .post(searchBaseUri)
                .contentType(contentType)
                .body("{}")

        when:
        def result = restTemplate.exchange(requestEntity, Map)

        then: "Search ok"
        result.statusCode == HttpStatus.OK
        result.headers.getContentType() == contentType
        and: "result contains > 0 items"
        def items = result.body.data
        items
        items.size() > 0
        and: "each item has a type, id, and attributes"
        items.every { item ->
            item.id instanceof String &&
              item.type instanceof String &&
              item.attributes instanceof Map
        }
    }

    def 'valid search returns ok and results, if json has queries, filters, formatting'() {
        def requestEntity = RequestEntity
                .post(searchBaseUri)
                .contentType(contentType)
                .body(searchqueriesfiltersformatting)

        when:
        def result = restTemplate.exchange(requestEntity, Map)

        then: "Search ok"
        result.statusCode == HttpStatus.OK
        result.headers.getContentType() == contentType
        and: "result contains > 0 items"
        def items = result.body.data
        items
        items.size() > 0
        and: "each item has a type, id, and attributes"
        items.every { item ->
            item.id instanceof String &&
                    item.type instanceof String &&
                    item.attributes instanceof Map
        }
    }
}