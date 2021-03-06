require "aws-sdk"

class AwsService
  def object_uploaded?(s3, bucket_name, object_key, path)
    response = s3.bucket(bucket_name).object(object_key).upload_file(path) #file location
  end

  def uploadToS3(path, fileID, pdfBase64 = nil)
    #creating aws client for S3 service
    s3 = Aws::S3::Resource.new(
      access_key_id: Rails.application.credentials.aws.access_key_id,
      secret_access_key: Rails.application.credentials.aws.secret_access_key,
      region: Rails.application.credentials.aws.region,
    )
    bucket_name = "team3-pdfers-rateconfocr-bucket" #always remains the same
    object_key = File.basename(fileID.to_s + ".pdf")
    if object_uploaded?(s3, bucket_name, object_key, path)
      puts "Object '#{object_key}' uploaded to bucket - '#{bucket_name}'."
      PdfService.new.deleteTempPdf(path)
      return object_key
    else
      puts "Object '#{object_key}' not uploaded to bucket - '#{bucket_name}'."
    end
  end

  def awsTextract(fileName)
    textract = Aws::Textract::Client.new(
      access_key_id: Rails.application.credentials.aws.access_key_id,
      secret_access_key: Rails.application.credentials.aws.secret_access_key,
      region: Rails.application.credentials.aws.region,
    )

    requestResponse = textract.start_document_analysis({
      document_location: {
        s3_object: {
          bucket: "team3-pdfers-rateconfocr-bucket",
          name: fileName,
        },
      },
      feature_types: ["TABLES", "FORMS"],
    })
    return requestResponse.job_id
  end
end
