<?php
/**
 * Packion Systems - Inquiry Form Handler
 */

const INQUIRY_RECIPIENT_EMAIL = 'info@packion.co.in';
const INQUIRY_RECIPIENT_NAME = 'Packion Website';
const SMTP_USERNAME = 'vivekpatel2472003@gmail.com';
const SMTP_PASSWORD = 'lyxiohxgeariabih';

function clean_input($value) {
    return htmlspecialchars(strip_tags(trim($value ?? '')), ENT_QUOTES, 'UTF-8');
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name         = clean_input($_POST["fullName"] ?? '');
    $company      = clean_input($_POST["companyName"] ?? '');
    $phone        = clean_input($_POST["phoneNumber"] ?? '');
    $email        = filter_var(trim($_POST["emailAddress"] ?? ''), FILTER_SANITIZE_EMAIL);
    $product_type = clean_input($_POST["reqType"] ?? '');
    $message      = clean_input($_POST["message"] ?? '');

    if (empty($name) || empty($email) || empty($phone) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Please fill in all required fields.";
        exit;
    }

    try {
        $subject = "New Inquiry from " . $name;
        $email_body = "
        <div style='font-family: Arial, sans-serif; background-color: #f5f8fb; padding: 40px 20px; color: #102335;'>
            <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e8ed;'>
                <div style='background-color: #065a98; padding: 25px 30px; text-align: center;'>
                    <h1 style='color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;'>Packion Systems</h1>
                    <p style='color: #bfe8ff; margin: 5px 0 0; font-size: 14px;'>New Website Inquiry Received</p>
                </div>
                <div style='padding: 30px;'>
                    <p style='font-size: 16px; line-height: 1.5; margin-bottom: 25px;'>Hello Team,<br><br>You have received a new inquiry from the website contact form. Here are the details:</p>
                    <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse: collapse; margin-bottom: 25px;'>
                        <tr>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; width: 35%; color: #526474; font-weight: bold;'>Name</td>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: 600;'>{$name}</td>
                        </tr>
                        <tr>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; color: #526474; font-weight: bold;'>Company</td>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: 600;'>{$company}</td>
                        </tr>
                        <tr>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; color: #526474; font-weight: bold;'>Email Address</td>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: 600;'><a href='mailto:{$email}' style='color: #065a98; text-decoration: none;'>{$email}</a></td>
                        </tr>
                        <tr>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; color: #526474; font-weight: bold;'>Phone Number</td>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: 600;'><a href='tel:{$phone}' style='color: #065a98; text-decoration: none;'>{$phone}</a></td>
                        </tr>
                        <tr>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; color: #526474; font-weight: bold;'>Requirement</td>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: 600;'>{$product_type}</td>
                        </tr>
                    </table>
                    <div style='background-color: #f9fbfd; border-left: 4px solid #6abbe2; padding: 20px; border-radius: 4px;'>
                        <h4 style='margin: 0 0 10px 0; color: #065a98; font-size: 15px;'>Message Details:</h4>
                        <p style='margin: 0; font-size: 15px; line-height: 1.6; color: #333; white-space: pre-wrap;'>{$message}</p>
                    </div>
                </div>
                <div style='background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e1e8ed;'>
                    <p style='margin: 0; font-size: 12px; color: #7393ae;'>This email was generated automatically from the Packion Systems website contact form.</p>
                </div>
            </div>
        </div>
        ";

        $phpmailer_files = [
            __DIR__ . '/phpmailer/Exception.php',
            __DIR__ . '/phpmailer/PHPMailer.php',
            __DIR__ . '/phpmailer/SMTP.php',
        ];

        if (file_exists($phpmailer_files[0]) && file_exists($phpmailer_files[1]) && file_exists($phpmailer_files[2])) {
            require_once $phpmailer_files[0];
            require_once $phpmailer_files[1];
            require_once $phpmailer_files[2];

            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = SMTP_USERNAME;
            $mail->Password   = SMTP_PASSWORD;
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;
            $mail->setFrom(SMTP_USERNAME, INQUIRY_RECIPIENT_NAME);
            $mail->addAddress(INQUIRY_RECIPIENT_EMAIL);
            $mail->addReplyTo($email, $name);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $email_body;
            $mail->send();
        } else {
            $headers = [
                'MIME-Version: 1.0',
                'Content-type: text/html; charset=UTF-8',
                'From: ' . INQUIRY_RECIPIENT_NAME . ' <' . INQUIRY_RECIPIENT_EMAIL . '>',
                'Reply-To: ' . $name . ' <' . $email . '>',
            ];

            if (!mail(INQUIRY_RECIPIENT_EMAIL, $subject, $email_body, implode("\r\n", $headers))) {
                throw new Exception('Server mail function failed.');
            }
        }

        header("Location: contact.html?status=success");
        exit;
    } catch (Throwable $e) {
        echo "Message could not be sent. Please email us directly at " . INQUIRY_RECIPIENT_EMAIL . ".";
    }
} else {
    header("Location: contact.html");
    exit;
}
?>
